const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

// Order routes
router.post('/', protect, createOrder);                       // Create order
router.get('/', protect, getUserOrders);                      // Get all orders for the logged-in user
router.patch('/:id', protect, updateOrderStatus);             // Update order status
router.delete('/:id', protect, deleteOrder);                  // Delete order

module.exports = router;
