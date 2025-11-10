// models/FloorPlan.js - Floor Plan Model

const mongoose = require("mongoose");

const floorPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  seats: [{
    seatNumber: { type: Number, required: true },
    occupied: { type: Boolean, default: false }
  }],
  rooms: [
    {
      roomNumber: { type: Number, required: true },
      capacity: { type: Number, required: true },
      booked: { type: Boolean, default: false },
      bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      bookedUntil: { type: Date },
      bookingCount: { type: Number, default: 0 },
      lastBookedAt: { type: Date },
    },
  ],
  // version control fields
  version: {
    type: Number,
    default: 1
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now
  }
});

const FloorPlan = mongoose.model("FloorPlan", floorPlanSchema);

module.exports = FloorPlan;

