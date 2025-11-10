// controllers/roomController.js - Room Booking Controllers

const FloorPlan = require("../models/FloorPlan");

// Suggest best room based on participants
const suggestRoom = async (req, res) => {
  try {
    const { participants } = req.body;
    if (!participants)
      return res.status(400).json({ message: 'Number of participants is required' });

    const floorPlan = await FloorPlan.findById(req.params.id);
    if (!floorPlan) return res.status(404).json({ message: 'Floor plan not found' });

    const availableRooms = floorPlan.rooms.filter((r) => !r.booked);

    if (availableRooms.length === 0)
      return res.status(400).json({ message: 'No rooms available for booking' });

    // Sort by closest fit capacity, then by least used
    const bestRoom = availableRooms
      .filter((r) => r.capacity >= participants)
      .sort((a, b) => {
        const diffA = a.capacity - participants;
        const diffB = b.capacity - participants;
        if (diffA === diffB) return (a.bookingCount || 0) - (b.bookingCount || 0);
        return diffA - diffB;
      })[0];

    if (!bestRoom)
      return res.status(400).json({ message: 'No suitable room found for given participants' });

    res.json({ suggestedRoom: bestRoom });
  } catch (err) {
    console.error('Suggest room error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Book a room
const bookRoom = async (req, res) => {
  try {
    const { userId, durationMinutes = 60 } = req.body; // default booking duration
    const floorPlan = await FloorPlan.findById(req.params.id);
    if (!floorPlan) return res.status(404).json({ message: 'Floor plan not found' });

    const room = floorPlan.rooms.find((r) => r.roomNumber === Number(req.params.roomNumber));
    if (!room) return res.status(404).json({ message: 'Room not found' });

    if (room.booked)
      return res.status(400).json({ message: 'Room already booked' });

    // Book the room
    room.booked = true;
    room.bookedBy = userId || null;
    room.lastBookedAt = new Date();
    room.bookingCount = (room.bookingCount || 0) + 1;
    room.bookedUntil = new Date(Date.now() + durationMinutes * 60000);

    await floorPlan.save();
    res.json({ message: 'Room booked successfully', room });
  } catch (err) {
    console.error('Book room error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Unbook a room
const unbookRoom = async (req, res) => {
  try {
    const { userId } = req.body;
    const floorPlan = await FloorPlan.findById(req.params.id);
    if (!floorPlan) return res.status(404).json({ message: "Floor plan not found" });

    const room = floorPlan.rooms.find(
      (r) => r.roomNumber === Number(req.params.roomNumber)
    );
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (!room.booked)
      return res.status(400).json({ message: "Room is not currently booked" });

    // Only the user who booked it can unbook
    if (userId && room.bookedBy && String(room.bookedBy) !== userId) {
      return res.status(403).json({ message: "You cannot unbook a room booked by another user" });
    }

    room.booked = false;
    room.bookedBy = null;
    room.bookedUntil = null;

    floorPlan.version++;
    await floorPlan.save();

    res.json({
      message: `Room ${room.roomNumber} unbooked successfully`,
      room,
      floorPlan,
    });
  } catch (err) {
    console.error("Unbooking error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  suggestRoom,
  bookRoom,
  unbookRoom
};

