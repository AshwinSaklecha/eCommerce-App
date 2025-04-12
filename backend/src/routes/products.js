const express = require('express');
const { auth, checkRole } = require('../middleware/auth');
const Product = require('../models/Product');
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, brand } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    console.error('Get product error:', err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (admin only)
router.post('/', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const { name, description, category, brand, variants, images, features } = req.body;
    
    const product = new Product({
      name,
      description,
      category,
      brand,
      variants: variants || [],
      images: images || [],
      features: features || []
    });
    
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (admin only)
router.put('/:id', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const { name, description, category, brand, variants, images, features } = req.body;
    
    const productFields = {};
    if (name) productFields.name = name;
    if (description) productFields.description = description;
    if (category) productFields.category = category;
    if (brand) productFields.brand = brand;
    if (variants) productFields.variants = variants;
    if (images) productFields.images = images;
    if (features) productFields.features = features;
    
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: productFields },
      { new: true }
    );
    
    res.json(product);
  } catch (err) {
    console.error('Update product error:', err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (admin only)
router.delete('/:id', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await Product.findByIdAndRemove(req.params.id);
    
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error('Delete product error:', err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product variant stock (admin only)
router.patch('/:id/stock', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const { variantId, stock } = req.body;
    
    if (!variantId || stock === undefined) {
      return res.status(400).json({ message: 'Variant ID and stock are required' });
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const variant = product.variants.id(variantId);
    
    if (!variant) {
      return res.status(404).json({ message: 'Variant not found' });
    }
    
    variant.stock = stock;
    await product.save();
    
    res.json(product);
  } catch (err) {
    console.error('Update stock error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 