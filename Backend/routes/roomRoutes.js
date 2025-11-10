// routes/roomRoutes.js - Room Booking Routes

const express = require("express");
const router = express.Router();
const authMiddleware = require("../utils/authMiddleware");
const { suggestRoom, bookRoom, unbookRoom } = require("../controllers/roomController");

// Room booking routes
router.post("/floorplans/:id/suggest-room", suggestRoom);
router.post("/floorplans/:id/book-room/:roomNumber", bookRoom);
router.post("/floorplans/:id/unbook-room/:roomNumber", authMiddleware, unbookRoom);

module.exports = router;

