const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');

// Base64 SVG data URLs for fans and ACs that work anywhere
const FAN_SVG_DATA_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSIjMDA3YmZmIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iI2U2ZjJmZiIgLz48cGF0aCBkPSJNNTAgMTBDMjguNDIgMTAgMTEgMjcuNDIgMTEgNDlzMTcuNDIgMzkgMzkgMzkgMzktMTcuNDIgMzktMzlTNzEuNTggMTAgNTAgMTB6bTAgNzBjLTE3LjEgMC0zMS0xMy45LTMxLTMxczEzLjktMzEgMzEtMzEgMzEgMTMuOSAzMSAzMS0xMy45IDMxLTMxIDMxeiIgZmlsbD0iIzAwN2JmZiIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjgiIGZpbGw9IiMwMDdiZmYiIC8+PHBhdGggZD0iTTUwIDI1Yy0yLjc2IDAtNS0yLjI0LTUtNVYxNWMwLTIuNzYgMi4yNC01IDUtNXM1IDIuMjQgNSA1djVjMCAyLjc2LTIuMjQgNS01IDV6TTc1IDUwYzAtMi43NiAyLjI0LTUgNS01aDVjMi43NiAwIDUgMi4yNCA1IDVzLTIuMjQgNS01IDVoLTVjLTIuNzYgMC01LTIuMjQtNS01ek01MCA3NWMyLjc2IDAgNSAyLjI0IDUgNXY1YzAgMi43Ni0yLjI0IDUtNSA1cy01LTIuMjQtNS01di01YzAtMi43NiAyLjI0LTUgNS01ek0yNSA1MGMwIDIuNzYtMi4yNCA1LTUgNWgtNWMtMi43NiAwLTUtMi4yNC01LTVzMi4yNC01IDUtNWg1YzIuNzYgMCA1IDIuMjQgNSA1eiIgZmlsbD0iIzAwN2JmZiIvPjxwYXRoIGQ9Ik02Ny45MyAzMi4wN2MtMS45NS0xLjk1LTEuOTUtNS4xMiAwLTcuMDdsMy41NC0zLjU0YzEuOTUtMS45NSA1LjEyLTEuOTUgNy4wNyAwIDEuOTUgMS45NSAxLjk1IDUuMTIgMCA3LjA3bC0zLjU0IDMuNTRjLTEuOTUgMS45NS01LjEyIDEuOTUtNy4wNyAwek02Ny45MyA2Ny45M2MxLjk1LTEuOTUgNS4xMi0xLjk1IDcuMDcgMGwzLjU0IDMuNTRjMS45NSAxLjk1IDEuOTUgNS4xMiAwIDcuMDctMS45NSAxLjk1LTUuMTIgMS45NS03LjA3IDBsLTMuNTQtMy41NGMtMS45NS0xLjk1LTEuOTUtNS4xMiAwLTcuMDd6TTMyLjA3IDY3LjkzYy0xLjk1LTEuOTUtNS4xMi0xLjk1LTcuMDcgMGwtMy41NCAzLjU0Yy0xLjk1IDEuOTUtMS45NSA1LjEyIDAgNy4wNyAxLjk1IDEuOTUgNS4xMiAxLjk1IDcuMDcgMGwzLjU0LTMuNTRjMS45NS0xLjk1IDEuOTUtNS4xMiAwLTcuMDd6TTMyLjA3IDMyLjA3YzEuOTUtMS45NSAxLjk1LTUuMTIgMC03LjA3bC0zLjU0LTMuNTRjLTEuOTUtMS45NS01LjEyLTEuOTUtNy4wNyAwLTEuOTUgMS45NS0xLjk1IDUuMTIgMCA3LjA3bDMuNTQgMy41NGMxLjk1IDEuOTUgNS4xMiAxLjk1IDcuMDcgMHoiIGZpbGw9IiMwMDdiZmYiLz48L3N2Zz4=";

const AC_SVG_DATA_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSIjNDI5OWUxIj48cmVjdCB4PSIxMCIgeT0iMjAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI1MCIgcng9IjUiIGZpbGw9IiNlNmYyZmYiIHN0cm9rZT0iIzQyOTllMSIgc3Ryb2tlLXdpZHRoPSIzIi8+PHJlY3QgeD0iMjAiIHk9IjM1IiB3aWR0aD0iNjAiIGhlaWdodD0iMjAiIHJ4PSIyIiBmaWxsPSIjNDI5OWUxIiBvcGFjaXR5PSIwLjIiLz48Y2lyY2xlIGN4PSI4MCIgY3k9IjMwIiByPSIzIiBmaWxsPSIjNDI5OWUxIi8+PGNpcmNsZSBjeD0iNzAiIGN5PSIzMCIgcj0iMyIgZmlsbD0iIzQyOTllMSIvPjxwYXRoIGQ9Ik0zMCA3NSBMMzAgODUgTDcwIDg1IEw3MCA3NSIgc3Ryb2tlPSIjNDI5OWUxIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTUgNDUgTDI1IDQ1IE0xNSA1NSBMMjUgNTUiIHN0cm9rZT0iIzQyOTllMSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNNzUgNDUgTDg1IDQ1IE03NSA1NSBMODUgNTUiIHN0cm9rZT0iIzQyOTllMSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=";

// Sample product data
const sampleProducts = [
  {
    name: 'Tower Fan',
    description: 'A powerful tower fan with oscillation for whole-room cooling. Features 3 speed settings and a remote control.',
    category: 'fan',
    brand: 'Dyson',
    variants: [
      {
        size: 'Standard',
        color: 'White',
        price: 199.99,
        stock: 15
      },
      {
        size: 'Standard',
        color: 'Black',
        price: 199.99,
        stock: 10
      }
    ],
    images: [FAN_SVG_DATA_URL],
    features: [
      'Oscillating function',
      'Remote control included',
      '3 speed settings',
      'Timer function',
      'Energy efficient'
    ]
  },
  {
    name: 'Split Air Conditioner',
    description: 'Energy-efficient split system AC with cooling and heating functions. Includes WiFi control and air purification.',
    category: 'ac',
    brand: 'Samsung',
    variants: [
      {
        size: '9000 BTU',
        color: 'White',
        price: 599.99,
        stock: 8
      },
      {
        size: '12000 BTU',
        color: 'White',
        price: 699.99,
        stock: 5
      }
    ],
    images: [AC_SVG_DATA_URL],
    features: [
      'WiFi enabled control',
      'Heating and cooling',
      'Energy rating: A+++',
      'Sleep mode',
      'Air purification'
    ]
  },
  {
    name: 'Premium Ceiling Fan',
    description: 'Modern ceiling fan with LED lighting and remote control. Features whisper-quiet operation and reversible blades.',
    category: 'fan',
    brand: 'Hunter',
    variants: [
      {
        size: '52 inch',
        color: 'Brushed Nickel',
        price: 249.99,
        stock: 12
      },
      {
        size: '52 inch',
        color: 'Matte Black',
        price: 259.99,
        stock: 8
      },
      {
        size: '44 inch',
        color: 'Brushed Nickel',
        price: 229.99,
        stock: 10
      }
    ],
    images: [FAN_SVG_DATA_URL],
    features: [
      'LED light included',
      'Remote control',
      'Whisper quiet operation',
      'Reversible motor for summer/winter use',
      '5 blade design'
    ]
  },
  {
    name: 'Portable Air Conditioner',
    description: 'Compact portable AC unit perfect for rooms up to 400 sq ft. Easy to move with included wheels and handle.',
    category: 'ac',
    brand: 'LG',
    variants: [
      {
        size: '8000 BTU',
        color: 'White',
        price: 349.99,
        stock: 20
      },
      {
        size: '10000 BTU',
        color: 'White',
        price: 429.99,
        stock: 15
      }
    ],
    images: [AC_SVG_DATA_URL],
    features: [
      'Cools rooms up to 400 sq ft',
      'Dehumidification function',
      'Easy-to-use control panel',
      'Programmable 24-hour timer',
      'Washable air filter'
    ]
  },
  {
    name: 'USB Desk Fan',
    description: 'Compact USB-powered desk fan with adjustable tilt and two speed settings. Perfect for office or desktop use.',
    category: 'fan',
    brand: 'Arctic',
    variants: [
      {
        size: 'Small',
        color: 'Black',
        price: 19.99,
        stock: 50
      },
      {
        size: 'Small',
        color: 'White',
        price: 19.99,
        stock: 45
      },
      {
        size: 'Small',
        color: 'Blue',
        price: 21.99,
        stock: 30
      }
    ],
    images: [FAN_SVG_DATA_URL],
    features: [
      'USB powered',
      'Adjustable tilt',
      'Two speed settings',
      'Ultra quiet operation',
      'Compact design'
    ]
  }
];

// Connect to MongoDB and seed data
const seedProducts = async () => {
  try {
    // Get MongoDB URI from environment variables or use fallback
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('No MongoDB URI found in environment variables');
      process.exit(1);
    }
    
    // Connect to MongoDB
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Delete existing products (optional)
    await Product.deleteMany({});
    console.log('Deleted existing products');

    // Insert sample products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Created ${createdProducts.length} products`);

    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedProducts(); 