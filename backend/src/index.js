const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const passport = require('passport');

// Load environment variables
dotenv.config();

// Load passport config
require('./config/passport');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

// Import seed data utility
const { seedAll } = require('./utils/seedData');

const app = express();

// Middleware
app.use(helmet());

// Configure CORS for all routes
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize passport
app.use(passport.initialize());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce')
  .then(() => {
    console.log('Connected to MongoDB');
    // Seed data
    seedAll();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Test route for debugging
app.get('/api/test-ping', (req, res) => {
  console.log('Ping received from:', req.get('origin'));
  res.header('Access-Control-Allow-Origin', '*');
  res.json({ 
    success: true, 
    message: 'API is accessible',
    timestamp: new Date().toISOString(),
    env: {
      node_env: process.env.NODE_ENV,
      mongodb_uri_exists: !!process.env.MONGODB_URI
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to E-commerce API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 