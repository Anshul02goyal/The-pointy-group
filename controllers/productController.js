const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const product = await Product.create({ name, description, price, stock });
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { name, minPrice, maxPrice, inStock, page = 1 } = req.query;

    const filter = {};
    if (name) filter.name = new RegExp(name, 'i');
    if (minPrice) filter.price = { $gte: minPrice };
    if (maxPrice) filter.price = { $lte: maxPrice };
    if (inStock) filter.stock = { $gt: 0 };

    const limit = 10;
    const skip = (page - 1) * limit;

    const products = await Product.find(filter).skip(skip).limit(limit);
    res.status(200).json({ success: true, products });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
