const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      // Check if user's email is in the approved list
      const user = req.user;
      const approvedEmailsCheck = await User.findOne({ 
        email: user.email, 
        isApproved: true 
      });

      if (!approvedEmailsCheck) {
        // Update user's approval status if email is found
        await User.findByIdAndUpdate(user._id, { isApproved: false });
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/unauthorized`);
      }

      // Generate JWT
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      
      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${token}`);
    } catch (err) {
      console.error('OAuth callback error:', err);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=auth_failed`);
    }
  }
);

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-__v');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
});

// Add approved email
router.post('/approved-emails', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user already exists with this email
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      // Update existing user to be approved
      existingUser.isApproved = true;
      await existingUser.save();
      return res.status(200).json({ message: 'User approved successfully' });
    }

    // Create new approved email entry
    const newUser = new User({
      email,
      isApproved: true,
      // These will be filled when the user actually signs in
      googleId: 'pending',
      name: 'Pending User'
    });
    
    await newUser.save();
    
    res.status(201).json({ message: 'Email added to approved list' });
  } catch (err) {
    console.error('Add approved email error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 