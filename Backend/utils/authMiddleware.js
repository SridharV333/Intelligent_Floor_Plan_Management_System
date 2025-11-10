// utils/authMiddleware.js - Authentication Middleware

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Missing Authorization header" });

    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Malformed Authorization header" });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach decoded user (userId, email, etc.)
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;

