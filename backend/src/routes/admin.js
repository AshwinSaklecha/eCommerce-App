const express = require('express');
const { auth, checkRole } = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Get all users (admin only)
router.get('/users', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    res.json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all approved emails (admin only)
router.get('/approved-emails', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const users = await User.find({ isApproved: true }).select('email isApproved');
    res.json(users);
  } catch (err) {
    console.error('Get approved emails error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add approved email (admin only)
router.post('/approved-emails', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user already exists with this email
    let user = await User.findOne({ email });
    
    if (user) {
      // Update existing user to be approved
      user.isApproved = true;
      await user.save();
      return res.status(200).json({ message: 'User approved successfully' });
    }

    // Create new approved email entry
    user = new User({
      email,
      isApproved: true,
      // These will be filled when the user actually signs in
      googleId: 'pending',
      name: 'Pending User'
    });
    
    await user.save();
    
    res.status(201).json({ message: 'Email added to approved list' });
  } catch (err) {
    console.error('Add approved email error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove approved email (admin only)
router.delete('/approved-emails/:id', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.isApproved = false;
    await user.save();
    
    res.json({ message: 'User removed from approved list' });
  } catch (err) {
    console.error('Remove approved email error:', err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role (admin only)
router.patch('/users/:id/role', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!role || !['admin', 'customer', 'rider'].includes(role)) {
      return res.status(400).json({ message: 'Valid role is required' });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.role = role;
    await user.save();
    
    res.json(user);
  } catch (err) {
    console.error('Update role error:', err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all riders (admin only)
router.get('/riders', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const riders = await User.find({ role: 'rider' }).select('name email');
    res.json(riders);
  } catch (err) {
    console.error('Get riders error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 