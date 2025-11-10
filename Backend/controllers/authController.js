// controllers/authController.js - Authentication Controllers

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../config/env");

// Signup
const signup = async (req, res) => {
  try {
    const { username, email, contactNumber, password } = req.body;
    if (!username || !email || !contactNumber || !password)
      return res.status(400).json({ message: "All fields are required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, contactNumber, password: hashedPassword });

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "8h" });
    const safeUser = { _id: user._id, username, email, contactNumber, createdAt: user.createdAt };

    res.status(201).json({ message: "Signup successful", user: safeUser, token });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

// Add User (Admin function)
const addUser = async (req, res) => {
  try {
    const { username, email, contactNumber, password } = req.body;
    if (!username || !email || !contactNumber || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, contactNumber, password: hashedPassword });
    await user.save();

    const safeUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      contactNumber: user.contactNumber,
      createdAt: user.createdAt,
    };
    res.status(201).json({ message: 'User created', user: safeUser });
  } catch (err) {
    console.error('add-user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    const safeUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      contactNumber: user.contactNumber,
      createdAt: user.createdAt
    };

    res.json({
      message: "Login successful",
      user: safeUser,
      token
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout (dummy endpoint for frontend compatibility)
const logout = (req, res) => {
  res.json({ message: "Logged out successfully" });
};

module.exports = {
  signup,
  addUser,
  login,
  logout
};

