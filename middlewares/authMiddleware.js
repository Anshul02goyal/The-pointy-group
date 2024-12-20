const jwt = require('jsonwebtoken');
const Blacklist = require('../models/Blacklist');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied' });
  }

  try {
    const isBlacklisted = await Blacklist.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ success: false, message: 'Token is invalidated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    req.user = user; 
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
