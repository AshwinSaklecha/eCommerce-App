const express = require('express');
const { auth, checkRole } = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');
const router = express.Router();

// Create order (customer)
router.post('/', auth, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    
    if (!items || !items.length || !shippingAddress) {
      return res.status(400).json({ message: 'Items and shipping address are required' });
    }
    
    // Calculate total amount and validate items
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      
      // Find the variant
      const variant = product.variants.find(
        v => v.size === item.variant.size && v.color === item.variant.color
      );
      
      if (!variant) {
        return res.status(404).json({ 
          message: `Variant not found for product: ${product.name} (${item.variant.size}, ${item.variant.color})` 
        });
      }
      
      // Check stock
      if (variant.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Not enough stock for ${product.name} (${item.variant.size}, ${item.variant.color})` 
        });
      }
      
      // Add to order items
      orderItems.push({
        product: product._id,
        variant: {
          size: item.variant.size,
          color: item.variant.color
        },
        quantity: item.quantity,
        price: variant.price
      });
      
      // Calculate total amount
      totalAmount += variant.price * item.quantity;
      
      // Update stock (decrement)
      variant.stock -= item.quantity;
      await product.save();
    }
    
    // Create order
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: 'pending'
    });
    
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders (admin)
router.get('/admin', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('rider', 'name email')
      .populate({
        path: 'items.product',
        select: 'name brand category'
      })
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    console.error('Get admin orders error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user orders (customer)
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate({
        path: 'items.product',
        select: 'name brand category images'
      })
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    console.error('Get user orders error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get rider orders (rider)
router.get('/rider-orders', [auth, checkRole(['rider'])], async (req, res) => {
  try {
    const orders = await Order.find({ 
      rider: req.user._id,
      status: { $in: ['shipped', 'delivered', 'undelivered'] }
    })
      .populate('user', 'name email')
      .populate({
        path: 'items.product',
        select: 'name brand category images'
      })
      .sort({ updatedAt: -1 });
    
    res.json(orders);
  } catch (err) {
    console.error('Get rider orders error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('rider', 'name email')
      .populate({
        path: 'items.product',
        select: 'name brand category images'
      });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check permission (only admin, order owner, or assigned rider can see)
    if (
      req.user.role !== 'admin' && 
      order.user._id.toString() !== req.user._id.toString() &&
      (!order.rider || order.rider._id.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (err) {
    console.error('Get order error:', err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (admin/rider)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status, riderId } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check permissions
    if (req.user.role === 'admin') {
      // Admin can update to any status
      order.status = status;
      
      // If status is shipped and rider is provided, assign rider
      if (status === 'shipped' && riderId) {
        order.rider = riderId;
      }
    } else if (req.user.role === 'rider') {
      // Rider can only update if assigned and only to delivered/undelivered
      if (!order.rider || order.rider.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this order' });
      }
      
      if (order.status !== 'shipped') {
        return res.status(400).json({ message: 'Can only update orders that are shipped' });
      }
      
      if (status !== 'delivered' && status !== 'undelivered') {
        return res.status(400).json({ message: 'Riders can only mark orders as delivered or undelivered' });
      }
      
      order.status = status;
    } else {
      return res.status(403).json({ message: 'Not authorized to update order status' });
    }
    
    order.updatedAt = Date.now();
    await order.save();
    
    res.json(order);
  } catch (err) {
    console.error('Update order status error:', err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark order as paid (update status from pending to paid)
router.patch('/:id/pay', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order is not in pending status' });
    }
    
    order.status = 'paid';
    order.updatedAt = Date.now();
    await order.save();
    
    res.json(order);
  } catch (err) {
    console.error('Mark as paid error:', err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 