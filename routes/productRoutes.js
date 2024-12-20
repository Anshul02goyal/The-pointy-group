const express = require('express');
const router = express.Router();
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
} = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');

// Product routes
router.post('/', protect, createProduct);               // Create product
router.patch('/:id', protect, updateProduct);           // Update product
router.delete('/:id', protect, deleteProduct);          // Delete product (soft delete)
router.get('/', getProducts);                           // Get products with optional filters

module.exports = router;
