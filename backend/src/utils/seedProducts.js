const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');

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
    images: ['/images/fan.svg'],
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
    images: ['/images/ac.svg'],
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
    images: ['/images/fan.svg'],
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
    images: ['/images/ac.svg'],
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
    images: ['/images/fan.svg'],
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
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
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