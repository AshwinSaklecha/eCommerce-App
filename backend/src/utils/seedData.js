const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ApprovedEmail = require('../models/ApprovedEmail');

// Seed approved emails
const seedApprovedEmails = async () => {
  try {
    const count = await ApprovedEmail.estimatedDocumentCount();
    
    if (count === 0) {
      await ApprovedEmail.create([
        { email: 'admin@example.com' },
        { email: 'customer@example.com' },
        { email: 'rider@example.com' }
      ]);
      console.log('Approved emails seeded successfully');
    }
  } catch (err) {
    console.error('Error seeding approved emails:', err);
  }
};

// Seed users
const seedUsers = async () => {
  try {
    const count = await User.estimatedDocumentCount();
    
    if (count === 0) {
      await User.create([
        {
          googleId: 'admin123',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
          isApproved: true
        },
        {
          googleId: 'customer123',
          email: 'customer@example.com',
          name: 'Regular Customer',
          role: 'customer',
          isApproved: true
        },
        {
          googleId: 'rider123',
          email: 'rider@example.com',
          name: 'Delivery Rider',
          role: 'rider',
          isApproved: true
        }
      ]);
      console.log('Users seeded successfully');
    }
  } catch (err) {
    console.error('Error seeding users:', err);
  }
};

// Seed products
const seedProducts = async () => {
  try {
    const count = await Product.estimatedDocumentCount();
    
    if (count === 0) {
      await Product.create([
        {
          name: 'Premium Ceiling Fan',
          description: 'High-quality ceiling fan with remote control',
          category: 'fan',
          brand: 'CoolBreeze',
          variants: [
            {
              size: 'small',
              color: 'white',
              price: 99.99,
              stock: 50
            },
            {
              size: 'medium',
              color: 'white',
              price: 149.99,
              stock: 30
            },
            {
              size: 'large',
              color: 'white',
              price: 199.99,
              stock: 20
            },
            {
              size: 'small',
              color: 'brown',
              price: 109.99,
              stock: 40
            },
            {
              size: 'medium',
              color: 'brown',
              price: 159.99,
              stock: 25
            },
            {
              size: 'large',
              color: 'brown',
              price: 209.99,
              stock: 15
            }
          ],
          images: [
            'https://images.unsplash.com/photo-1591189863345-9db058f9f8ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
            'https://images.unsplash.com/photo-1591189863345-9db058f9f8ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
          ],
          features: [
            'Remote controlled',
            'Energy efficient',
            '3-speed settings',
            'LED light included',
            'Quiet operation'
          ]
        },
        {
          name: 'Tower Fan',
          description: 'Sleek and modern tower fan with oscillation',
          category: 'fan',
          brand: 'AirMaster',
          variants: [
            {
              size: 'standard',
              color: 'white',
              price: 79.99,
              stock: 60
            },
            {
              size: 'standard',
              color: 'black',
              price: 79.99,
              stock: 45
            }
          ],
          images: [
            'https://images.unsplash.com/photo-1617950113364-e2805436d23c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
            'https://images.unsplash.com/photo-1617950113364-e2805436d23c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
          ],
          features: [
            'Oscillation function',
            'Timer settings',
            '3 fan speeds',
            'Remote control included',
            'Space-saving design'
          ]
        },
        {
          name: 'Portable Air Conditioner',
          description: 'Compact and efficient portable AC unit',
          category: 'ac',
          brand: 'CoolTech',
          variants: [
            {
              size: '8,000 BTU',
              color: 'white',
              price: 299.99,
              stock: 25
            },
            {
              size: '10,000 BTU',
              color: 'white',
              price: 349.99,
              stock: 20
            },
            {
              size: '12,000 BTU',
              color: 'white',
              price: 399.99,
              stock: 15
            }
          ],
          images: [
            'https://images.unsplash.com/photo-1585345222855-bcee93f09155?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
            'https://images.unsplash.com/photo-1585345222855-bcee93f09155?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
          ],
          features: [
            'Easy installation',
            'Digital controls',
            'Adjustable temperature',
            'Remote control included',
            'Energy-saving mode'
          ]
        },
        {
          name: 'Split Air Conditioner',
          description: 'High-efficiency split AC system with inverter technology',
          category: 'ac',
          brand: 'FrostyAir',
          variants: [
            {
              size: '9,000 BTU',
              color: 'white',
              price: 599.99,
              stock: 15
            },
            {
              size: '12,000 BTU',
              color: 'white',
              price: 699.99,
              stock: 10
            },
            {
              size: '18,000 BTU',
              color: 'white',
              price: 899.99,
              stock: 8
            },
            {
              size: '24,000 BTU',
              color: 'white',
              price: 1099.99,
              stock: 5
            }
          ],
          images: [
            'https://images.unsplash.com/photo-1614947698093-862348936096?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
            'https://images.unsplash.com/photo-1614947698093-862348936096?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
          ],
          features: [
            'Inverter technology',
            'Energy efficient',
            'Smart connectivity',
            'Sleep mode',
            'Anti-bacterial filter',
            'Self-cleaning function'
          ]
        },
        {
          name: 'USB Desk Fan',
          description: 'Compact USB-powered fan for office or home use',
          category: 'fan',
          brand: 'TinyBreeze',
          variants: [
            {
              size: 'small',
              color: 'black',
              price: 19.99,
              stock: 100
            },
            {
              size: 'small',
              color: 'white',
              price: 19.99,
              stock: 85
            },
            {
              size: 'small',
              color: 'blue',
              price: 24.99,
              stock: 50
            }
          ],
          images: [
            'https://images.unsplash.com/photo-1594588593402-daab7073e79d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
            'https://images.unsplash.com/photo-1594588593402-daab7073e79d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
          ],
          features: [
            'USB powered',
            'Adjustable speed',
            'Compact design',
            'Low power consumption',
            'Quiet operation'
          ]
        }
      ]);
      console.log('Products seeded successfully');
    }
  } catch (err) {
    console.error('Error seeding products:', err);
  }
};

// Seed all data
const seedAll = async () => {
  await seedApprovedEmails();
  await seedUsers();
  await seedProducts();
};

module.exports = { seedAll }; 