// controllers/bookingController.js - User Bookings Controller

const FloorPlan = require("../models/FloorPlan");

// Get all rooms booked by a specific user across all floor plans
const getMyBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const plans = await FloorPlan.find();

    const myRooms = [];
    plans.forEach((plan) => {
      plan.rooms.forEach((room) => {
        if (room.bookedBy && String(room.bookedBy) === userId) {
          myRooms.push({
            floorPlanId: plan._id,
            floorPlanName: plan.name,
            roomNumber: room.roomNumber,
            capacity: room.capacity,
            bookedUntil: room.bookedUntil,
          });
        }
      });
    });

    res.json({ count: myRooms.length, rooms: myRooms });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getMyBookings
};

