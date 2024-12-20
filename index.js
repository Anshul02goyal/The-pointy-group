// index.js
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectToDB = require('./db/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cron = require('node-cron');

// Import cron job functions
const { executeStockMonitor } = require('./cron/stockMonitor');
const { executeOrderReminder } = require('./cron/orderReminder');

const app = express();
const port = process.env.PORT || 3000;

// Connect to database
connectToDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Cron Job: Product Stock Monitoring
cron.schedule('0 0 * * *', executeStockMonitor); // Run at midnight

// Cron Job: Order Fulfillment Reminder
cron.schedule('0 * * * *', executeOrderReminder); // Run every hour

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
