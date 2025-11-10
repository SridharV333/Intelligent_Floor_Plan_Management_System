// app.js - Express Application Setup

const express = require("express");
const cors = require("cors");

// Import routes
const authRoutes = require("./routes/authRoutes");
const floorPlanRoutes = require("./routes/floorPlanRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", authRoutes);
app.use("/", floorPlanRoutes);
app.use("/", roomRoutes);
app.use("/", bookingRoutes);

// Catch-all route
app.get("/*", (req, res) => {
  res.status(404).send("Invalid route");
});

module.exports = app;

