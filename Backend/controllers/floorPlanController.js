// controllers/floorPlanController.js - Floor Plan Controllers

const FloorPlan = require("../models/FloorPlan");

// Get all floor plans
const getAllFloorPlans = async (req, res) => {
  try {
    const plans = await FloorPlan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new floor plan
const addFloorPlan = async (req, res) => {
  try {
    const newPlan = new FloorPlan(req.body);
    const saved = await newPlan.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Failed to add floor plan", error: err.message });
  }
};

// Update floor plan (with version conflict check)
const updateFloorPlan = async (req, res) => {
  try {
    const { version, name, description, seats, rooms } = req.body;

    // Find the existing plan
    const floorPlan = await FloorPlan.findById(req.params.id);
    if (!floorPlan) {
      return res.status(404).json({ message: 'Floor plan not found' });
    }

    // Version conflict detection
    if (version && version < floorPlan.version) {
      return res.status(409).json({
        message: 'Conflict detected. Another admin updated this floor plan.',
        currentVersion: floorPlan.version,
      });
    }

    // Update fields safely
    if (name !== undefined) floorPlan.name = name;
    if (description !== undefined) floorPlan.description = description;

    if (Array.isArray(seats)) {
      floorPlan.seats = seats.map((s) => ({
        seatNumber: Number(s.seatNumber),
        occupied: Boolean(s.occupied),
      }));
    }

    if (Array.isArray(rooms)) {
      floorPlan.rooms = rooms.map((r) => ({
        roomNumber: Number(r.roomNumber),
        capacity: Number(r.capacity),
        booked: Boolean(r.booked),
        bookedBy: r.bookedBy || null,
        bookingCount: r.bookingCount || 0,
        bookedUntil: r.bookedUntil || null,
        lastBookedAt: r.lastBookedAt || null,
      }));
    }

    // Increment version and update metadata
    floorPlan.version = (floorPlan.version || 1) + 1;
    floorPlan.lastModifiedAt = new Date();

    // Save the updated document
    const updated = await floorPlan.save();
    res.json({
      message: 'Floor plan updated successfully!',
      updatedPlan: updated,
    });
  } catch (error) {
    console.error('Update-floorplan error:', error);
    res.status(500).json({ message: 'Server error during update', error: error.message });
  }
};

// Delete floor plan
const deleteFloorPlan = async (req, res) => {
  try {
    const deleted = await FloorPlan.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Floor plan not found" });
    res.json({ message: "Floor plan deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Offline sync
const syncFloorPlan = async (req, res) => {
  try {
    const fp = await FloorPlan.findById(req.params.id);
    if (!fp) return res.status(404).json({ message: "Floor plan not found" });

    const { changes } = req.body;
    if (!Array.isArray(changes)) return res.status(400).json({ message: "Invalid sync data" });

    let modified = false;
    for (const ch of changes) {
      if (ch.type === "seat") {
        const seat = fp.seats.find((s) => s.seatNumber === ch.identifier);
        if (seat && ch.op === "update") {
          Object.assign(seat, ch.payload);
          modified = true;
        }
      } else if (ch.type === "room") {
        const room = fp.rooms.find((r) => r.roomNumber === ch.identifier);
        if (room && ch.op === "update") {
          Object.assign(room, ch.payload);
          modified = true;
        }
      }
    }

    if (modified) {
      fp.version++;
      await fp.save();
    }

    res.json({ message: "Sync successful", version: fp.version });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllFloorPlans,
  addFloorPlan,
  updateFloorPlan,
  deleteFloorPlan,
  syncFloorPlan
};

