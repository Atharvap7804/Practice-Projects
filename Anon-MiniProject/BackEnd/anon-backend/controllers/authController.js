const User = require('../models/User');
const bcrypt = require('bcrypt');

// Register Controller
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id, // include user ID here
        name: user.name,
        email: user.email
      }
    });
    
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({
      user: {
        id: user._id, // include user ID here too
        name: user.name,
        email: user.email
      }
    });
    
  } catch (err) {
    res.status(500).json({ message: 'Login error' });
  }
};

module.exports = {
  register,
  login
};
