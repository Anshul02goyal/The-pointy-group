// cron/stockMonitor.js
const nodemailer = require('nodemailer');
const Product = require('../models/Product');

// Setup nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Define the function to be executed
const executeStockMonitor = async () => {
  console.log('Running stock monitoring cron job...');
  const lowStockProducts = await Product.find({ stock: { $lt: 10 } });
  if (lowStockProducts.length) {
    const adminEmail = process.env.ADMIN_EMAIL;

    const message = {
      from: process.env.EMAIL,
      to: adminEmail,
      subject: 'Low Stock Alert',
      text: `The following products are low in stock: ${lowStockProducts
        .map((p) => `${p.name} (Stock: ${p.stock})`)
        .join(', ')}`,
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
      } else {
        console.log('Low stock email sent:', info.response);
      }
    });
  } else {
    console.log('No products with low stock.');
  }
};

// Export the function
module.exports = { executeStockMonitor };
