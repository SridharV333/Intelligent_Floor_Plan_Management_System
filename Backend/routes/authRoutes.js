// routes/authRoutes.js - Authentication Routes

const express = require("express");
const router = express.Router();
const { signup, addUser, login, logout } = require("../controllers/authController");

// Public routes
router.post("/signup", signup);
router.post("/add-user", addUser);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;

