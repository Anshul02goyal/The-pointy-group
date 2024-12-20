const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const { products, totalAmount } = req.body;
    const order = await Order.create({
      user: req.user._id,
      products,
      totalAmount,
    });
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const {page = 1, limit = 10} = req.query;
    const skip = (page - 1)* limit;

    const orders = await Order.find({ user: req.user._id }).skip(skip).limit(limit);
    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    await Order.deleteOne({ _id: orderId });

    return res.status(200).send({ message: "Order deleted successfully" });
  } catch (error) {
    return res.status(500).send({ message: "Error deleting order", error });
  }
};
