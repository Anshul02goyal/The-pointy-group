const User = require('../models/User');
const Blacklist = require('../models/Blacklist');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const isUserAlready = await User.findOne({email});
    if(isUserAlready){
        return res.status(400).json({success: false, msg: 'User Already Exists'})
    }
    const hashedPassword = await User.hashPassword(password);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = user.generateAuthToken();
    res.status(200).json({ success: true, token, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    await Blacklist.create({token});

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Error logging out" });
  }
};
