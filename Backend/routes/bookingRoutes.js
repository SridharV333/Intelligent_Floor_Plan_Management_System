// routes/bookingRoutes.js - User Bookings Routes

const express = require("express");
const router = express.Router();
const authMiddleware = require("../utils/authMiddleware");
const { getMyBookings } = require("../controllers/bookingController");

// User bookings route
router.get("/my-bookings/:userId", authMiddleware, getMyBookings);

module.exports = router;

