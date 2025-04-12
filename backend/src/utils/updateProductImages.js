require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// High-quality placeholder images from Unsplash
const IMAGE_PLACEHOLDERS = {
  fan: [
    'https://images.unsplash.com/photo-1585517920079-740272f7eaf4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1573511860302-28c11ff96cd5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  ],
  ac: [
    'https://images.unsplash.com/photo-1614947698058-74b0d996d7a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1621371205896-3082fa811be9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  ],
  // Fallback for any other categories
  default: [
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  ]
};

// Map of specific brands to specific images (optional)
const BRAND_SPECIFIC_IMAGES = {
  'Dyson': [
    'https://images.unsplash.com/photo-1618941545015-2a39cca8af9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  ],
  'Samsung': [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  ],
};

const updateProductImages = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products to update`);

    // Update each product with appropriate images
    for (const product of products) {
      let images;

      // First check if we have brand-specific images
      if (BRAND_SPECIFIC_IMAGES[product.brand]) {
        images = BRAND_SPECIFIC_IMAGES[product.brand];
      } 
      // Then fallback to category-based images
      else if (IMAGE_PLACEHOLDERS[product.category]) {
        images = IMAGE_PLACEHOLDERS[product.category];
      } 
      // Finally use default images if nothing else matches
      else {
        images = IMAGE_PLACEHOLDERS.default;
      }

      // Update the product
      product.images = images;
      await product.save();
      console.log(`Updated product: ${product.name}`);
    }

    console.log('All products updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error updating product images:', error);
    process.exit(1);
  }
};

// Run the update function
updateProductImages(); 