// routes.js — Intelligent Floor Plan Management (Final Version)

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ===================== ENVIRONMENT CONFIG =====================
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env");
  process.exit(1);
}

// ===================== DATABASE CONNECTION =====================
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ===================== SCHEMAS =====================

// Seat Schema
const seatSchema = new mongoose.Schema(
  {
    seatNumber: { type: Number, required: true },
    occupied: { type: Boolean, default: false },
  },
  { _id: false }
);

// Room Schema
const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: Number, required: true },
    capacity: { type: Number, required: true },
    booked: { type: Boolean, default: false },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    bookedUntil: { type: Date, default: null },
    lastBookedAt: { type: Date, default: null },
    bookingCount: { type: Number, default: 0 },
  },
  { _id: false }
);

// Floor Plan Schema
//************************************ Defining Schema ************************************/
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
  rooms: [{
    roomNumber: { type: Number, required: true },
    capacity: { type: Number, required: true },
    booked: { type: Boolean, default: false }
  }],

  // 🆕 version control fields
  version: {
    type: Number,
    default: 1
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now
  }
});


// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contactNumber: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const FloorPlan = mongoose.model("FloorPlan", floorPlanSchema);
const User = mongoose.model("User", userSchema);

// 🔒 Authentication Middleware
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

// ===================== AUTH ROUTES =====================

// Signup
app.post("/signup", async (req, res) => {
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
});

app.post('/add-user', async (req, res) => {
  try {
    const { username, email, contactNumber, password } = req.body;
    if (!username || !email || !contactNumber || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    // Hash the password before saving
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
});


// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid credentials' });

    // Compare with bcrypt
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
});
// Logout (dummy endpoint for frontend compatibility)
app.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

// ===================== FLOOR PLAN ROUTES =====================

// Get all floor plans
app.get("/floorplans", authMiddleware, async (req, res) => {
  try {
    const plans = await FloorPlan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new floor plan
app.post("/add-floorplan", authMiddleware, async (req, res) => {
  try {
    const newPlan = new FloorPlan(req.body);
    const saved = await newPlan.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Failed to add floor plan", error: err.message });
  }
});

// Update floor plan (with version conflict check)
// PUT update a floor plan by ID (with version control)
app.put('/update-floorplan/:id', async (req, res) => {
  try {
    const { version } = req.body; // version from frontend
    const floorPlan = await FloorPlan.findById(req.params.id);

    if (!floorPlan) {
      return res.status(404).json({ message: 'Floor plan not found' });
    }

    // 🧠 Version check — prevents overwriting a newer version
    if (err.response?.status === 409) {
      console.warn('Conflict during sync. Keeping unsynced data for review.');
      // keep local copy instead of clearing
    } else {
      clearOfflineChanges();
    }


    if (version && version < floorPlan.version) {
      return res.status(409).json({
        message: 'Conflict detected. The floor plan was updated by another admin.',
        currentVersion: floorPlan.version,
      });
    }

    // If ok → update and increment version
    const updated = await FloorPlan.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        version: floorPlan.version + 1,
        lastModifiedAt: new Date()
      },
      { new: true }
    );

    res.json({
      message: 'Floor plan updated successfully',
      updatedPlan: updated
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ message: error.message });
  }
});


// Delete floor plan
app.delete("/delete-floorplan/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await FloorPlan.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Floor plan not found" });
    res.json({ message: "Floor plan deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// // ===================== MEETING ROOM ROUTES =====================

// // Suggest best room based on participants
// app.get("/floorplans/:id/suggest-room", authMiddleware, async (req, res) => {
//   try {
//     const participants = Number(req.query.participants || 1);
//     const fp = await FloorPlan.findById(req.params.id);
//     if (!fp) return res.status(404).json({ message: "Floor plan not found" });

//     const candidates = fp.rooms.filter((r) => !r.booked && r.capacity >= participants);
//     if (candidates.length === 0) return res.status(404).json({ message: "No suitable room available" });

//     candidates.sort((a, b) => a.capacity - b.capacity);
//     const best = candidates[0];
//     res.json({ suggestedRoom: best });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Book a room
// app.post("/floorplans/:id/book-room/:roomNumber", authMiddleware, async (req, res) => {
//   try {
//     const { userId, durationMinutes = 60 } = req.body;
//     const fp = await FloorPlan.findById(req.params.id);
//     if (!fp) return res.status(404).json({ message: "Floor plan not found" });

//     const room = fp.rooms.find((r) => r.roomNumber === Number(req.params.roomNumber));
//     if (!room) return res.status(404).json({ message: "Room not found" });
//     if (room.booked) return res.status(409).json({ message: "Room already booked" });

//     room.booked = true;
//     room.bookedBy = userId;
//     room.bookedUntil = new Date(Date.now() + durationMinutes * 60000);
//     room.lastBookedAt = new Date();
//     room.bookingCount = (room.bookingCount || 0) + 1;

//     fp.version++;
//     await fp.save();
//     res.json({ message: "Room booked successfully", room });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Unbook a room
// app.post("/floorplans/:id/unbook-room/:roomNumber", authMiddleware, async (req, res) => {
//   try {
//     const fp = await FloorPlan.findById(req.params.id);
//     if (!fp) return res.status(404).json({ message: "Floor plan not found" });

//     const room = fp.rooms.find((r) => r.roomNumber === Number(req.params.roomNumber));
//     if (!room) return res.status(404).json({ message: "Room not found" });

//     room.booked = false;
//     room.bookedBy = null;
//     room.bookedUntil = null;

//     fp.version++;
//     await fp.save();
//     res.json({ message: "Room unbooked successfully", room });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// ===================== MEETING ROOM ROUTES =====================

// Suggest best room based on participants
app.get("/floorplans/:id/suggest-room", authMiddleware, async (req, res) => {
  try {
    const participants = Number(req.query.participants || 1);
    const fp = await FloorPlan.findById(req.params.id);
    if (!fp) return res.status(404).json({ message: "Floor plan not found" });

    const available = fp.rooms.filter((r) => !r.booked && r.capacity >= participants);
    if (available.length === 0)
      return res.status(404).json({ message: "No suitable room available" });

    // Pick smallest room that fits participants
    const best = available.sort((a, b) => a.capacity - b.capacity)[0];
    res.json({ suggestedRoom: best });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Book a room
app.post("/floorplans/:id/book-room/:roomNumber", authMiddleware, async (req, res) => {
  try {
    const { userId, durationMinutes = 60 } = req.body;
    const floorPlan = await FloorPlan.findById(req.params.id);
    if (!floorPlan) return res.status(404).json({ message: "Floor plan not found" });

    const room = floorPlan.rooms.find(
      (r) => r.roomNumber === Number(req.params.roomNumber)
    );
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (room.booked)
      return res.status(409).json({ message: "Room already booked" });

    // Mark room as booked
    const expiry = new Date(Date.now() + durationMinutes * 60000);
    room.booked = true;
    room.bookedBy = userId;
    room.bookedUntil = expiry;
    room.lastBookedAt = new Date();
    room.bookingCount = (room.bookingCount || 0) + 1;

    floorPlan.version++;
    await floorPlan.save();

    res.json({
      message: `Room ${room.roomNumber} booked successfully`,
      room,
      floorPlan,
    });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Unbook a room
app.post("/floorplans/:id/unbook-room/:roomNumber", authMiddleware, async (req, res) => {
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
});



// ===================== USER BOOKINGS ROUTE =====================
// Returns all rooms booked by a specific user across all floor plans
app.get("/my-bookings/:userId", authMiddleware, async (req, res) => {
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
});


// ===================== OFFLINE SYNC ROUTE =====================
app.post("/floorplans/:id/sync", authMiddleware, async (req, res) => {
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
});

// ===================== CATCH-ALL ROUTE =====================
app.get("/*", (req, res) => {
  res.status(404).send("Invalid route");
});

// ===================== START SERVER =====================
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
