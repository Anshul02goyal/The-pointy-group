// cron/orderReminder.js
const nodemailer = require('nodemailer');
const Order = require('../models/Order');

// Setup nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Define the function to be executed
const executeOrderReminder = async () => {
  console.log('Running order fulfillment reminder cron job...');
  const pendingOrders = await Order.find({
    status: 'Pending',
    createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Orders older than 24 hours
  }).populate('user', 'email');

  if (pendingOrders.length) {
    pendingOrders.forEach((order) => {
      const message = {
        from: process.env.EMAIL,
        to: order.user.email,
        subject: 'Order Fulfillment Reminder',
        text: `Dear ${order.user.name}, your order #${order._id} is still pending. Please take action.`,
      };

      transporter.sendMail(message, (err, info) => {
        if (err) {
          console.error('Error sending email:', err);
        } else {
          console.log('Order reminder email sent:', info.response);
        }
      });
    });
  } else {
    console.log('No pending orders requiring reminders.');
  }
};

// Export the function
module.exports = { executeOrderReminder };
