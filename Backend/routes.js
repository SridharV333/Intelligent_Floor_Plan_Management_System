//********************************* Connection Requirements (Postman and MongoDb) ************************************* */
const express = require("express");
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

require("dotenv").config();
const port = 8000;

app.listen(port,()=>{
  console.log(`Server listening at http://localhost:${port}`);
})

const mongoose = require("mongoose");
const uri = "mongodb+srv://sridharvasudevan2004_db_user:PeJxQYIkr3QilRp3@moveinsyncproj.uobwxeq.mongodb.net/?appName=MoveInSyncProj";
mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connected…"))
  .catch((err) => console.log(err));

//************************************ Defining Schema ************************************/
// Define the schema for floor plans
const floorPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  seats: [{
    seatNumber: {
      type: Number,
      required: true
    },
    occupied: {
      type: Boolean,
      default: false
    }
  }],
  rooms: [{
    roomNumber: {
      type: Number,
      required: true
    },
    capacity: {
      type: Number,
      required: true
    },
    booked: {
      type: Boolean,
      default: false
    }
  }],
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  password: {                 // added password field (plaintext for demo only)
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const FloorPlan = mongoose.model("FloorPlan", floorPlanSchema);
const User = mongoose.models?.User || mongoose.model('User', userSchema);

app.use(express.json());


//****************************************** Sample Data *******************************/
// const floorPlans = [
//   {
//     name: "Main Office Floor Plan",
//     description: "Floor plan for the main office building",
//     seats: [
//       { seatNumber: 1, occupied: false },
//       { seatNumber: 2, occupied: true },
//       { seatNumber: 3, occupied: true },
//       { seatNumber: 4, occupied: false },
//       { seatNumber: 5, occupied: true },
//       { seatNumber: 6, occupied: false },
//       { seatNumber: 7, occupied: true },
//       { seatNumber: 8, occupied: false },
//       { seatNumber: 9, occupied: true },
//       { seatNumber: 10, occupied: false },
//     ],
//     rooms: [
//       { roomNumber: 101, capacity: 20, booked: false },
//       { roomNumber: 102, capacity: 15, booked: true },
//       { roomNumber: 103, capacity: 25, booked: false },
//       { roomNumber: 104, capacity: 10, booked: true },
//       { roomNumber: 105, capacity: 30, booked: false },
//     ],
//   },
//   {
//     name: "Tech Park Floor Plan",
//     description: "Floor plan for the technology park",
//     seats: [
//       { seatNumber: 1, occupied: false },
//       { seatNumber: 2, occupied: true },
//       { seatNumber: 3, occupied: false },
//       { seatNumber: 4, occupied: true },
//       { seatNumber: 5, occupied: false },
//       { seatNumber: 6, occupied: true },      
//       { seatNumber: 7, occupied: false },
//       { seatNumber: 8, occupied: true },
//       { seatNumber: 9, occupied: false },
//       { seatNumber: 10, occupied: true },
//     ],
//     rooms: [
//       { roomNumber: 201, capacity: 30, booked: false },
//       { roomNumber: 202, capacity: 25, booked: false },
//       { roomNumber: 203, capacity: 35, booked: false },
//       { roomNumber: 204, capacity: 15, booked: false },
//       { roomNumber: 205, capacity: 25, booked: false },
//     ],
//   },
//   {
//     name: "City Center Office Floor Plan",
//     description: "Floor plan for the city center office location",
//     seats: [
//       { seatNumber: 1, occupied: false },
//       { seatNumber: 2, occupied: true },
//       { seatNumber: 3, occupied: false },
//       { seatNumber: 4, occupied: true },
//       { seatNumber: 5, occupied: false },
//       { seatNumber: 6, occupied: true },      
//       { seatNumber: 7, occupied: false },
//       { seatNumber: 8, occupied: true },
//       { seatNumber: 9, occupied: false },
//       { seatNumber: 10, occupied: true },
//     ],
//     rooms: [
//       { roomNumber: 301, capacity: 40, booked: false },
//       { roomNumber: 302, capacity: 20, booked: false },
//       { roomNumber: 303, capacity: 30, booked: false },
//       { roomNumber: 304, capacity: 25, booked: false },
//       { roomNumber: 305, capacity: 35, booked: false },
//     ],
//   },
//   {
//     name: "Industrial Park Floor Plan",
//     description: "Floor plan for the industrial park",
//     seats: [
//       { seatNumber: 1, occupied: false },
//       { seatNumber: 2, occupied: false },
//       { seatNumber: 3, occupied: false },
//       { seatNumber: 4, occupied: true },
//       { seatNumber: 5, occupied: false },
//       { seatNumber: 6, occupied: true },      
//       { seatNumber: 7, occupied: false },
//       { seatNumber: 8, occupied: true },
//       { seatNumber: 9, occupied: false },
//       { seatNumber: 10, occupied: true },
//     ],
//     rooms: [
//       { roomNumber: 401, capacity: 50, booked: false },
//       { roomNumber: 402, capacity: 45, booked: false },
//       { roomNumber: 403, capacity: 60, booked: false },
//       { roomNumber: 404, capacity: 55, booked: false },
//       { roomNumber: 405, capacity: 40, booked: false },
//     ],
//   },
// ];


// const users = [
//   {
//     username: "user1",
//     email: "user1@example.com",
//     contactNumber: "1234567890"
//   },
//   {
//     username: "user2",
//     email: "user2@example.com",
//     contactNumber: "9876543210"
//   },
//   {
//     username: "user3",
//     email: "user3@example.com",
//     contactNumber: "1234577890"
//   },
//   {
//     username: "user4",
//     email: "user4@example.com",
//     contactNumber: "9876553210"
//   }
// ];

// ************************* Add sample documents to the database ***************************
// const addDocsToDB = async () => {
//   try {
//     await FloorPlan.insertMany(floorPlans);
//     console.log("Plans added successfully!");
//
//     await User.insertMany(users);
//     console.log("Users added successfully!");
//   } catch (error) {
//     console.error("Error adding Plans:", error);
//   }
// };
// addDocsToDB();


// ***********************************List of Possible Routes*********************************
//***************************************** GET *******************************************

// GET all floor plans

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email: email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // NOTE: plaintext comparison — replace with bcrypt.compare in production
    if (user.password !== password) return res.status(401).json({ message: 'Invalid credentials' });

    // Do not send password back
    const safeUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      contactNumber: user.contactNumber,
      createdAt: user.createdAt
    };

    res.json({ message: 'Login successful', user: safeUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/floorplans', async (req, res) => {
  try {
    const floorPlans = await FloorPlan.find();
    res.json(floorPlans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single floor plan by ID
app.get('/floorplans/:id', async (req, res) => {
  try {
    const floorPlan = await FloorPlan.findById(req.params.id);
    if (floorPlan) {
      res.json(floorPlan);
    } else {
      res.status(404).json({ message: 'Floor plan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new floor plan
app.post('/add-floorplan', async (req, res) => {
  const floorPlan = new FloorPlan(req.body);
  try {
    const newFloorPlan = await floorPlan.save();
    res.status(201).json(newFloorPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update a floor plan by ID
app.put('/update-floorplan/:id', async (req, res) => {
  try {
    const floorPlan = await FloorPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (floorPlan) {
      res.json(floorPlan);
    } else {
      res.status(404).json({ message: 'Floor plan not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH update a floor plan by ID
app.patch('/update-floorplan/:id', async (req, res) => {
  try {
    const floorPlan = await FloorPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (floorPlan) {
      res.json(floorPlan);
    } else {
      res.status(404).json({ message: 'Floor plan not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH update a seat in a floor plan by seat number
app.patch('/floorplans/:id/seats/:seatNumber', async (req, res) => {
  try {
    const floorPlan = await FloorPlan.findById(req.params.id);
    if (!floorPlan) {
      return res.status(404).json({ message: 'Floor plan not found' });
    }
    const seatIndex = floorPlan.seats.findIndex(seat => seat.seatNumber === req.params.seatNumber);
    if (seatIndex === -1) {
      return res.status(404).json({ message: 'Seat not found' });
    }
    floorPlan.seats[seatIndex] = { ...floorPlan.seats[seatIndex], ...req.body };
    await floorPlan.save();
    res.json(floorPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH update a room in a floor plan by room number
app.patch('/floorplans/:id/rooms/:roomNumber', async (req, res) => {
  try {
    const floorPlan = await FloorPlan.findById(req.params.id);
    if (!floorPlan) {
      return res.status(404).json({ message: 'Floor plan not found' });
    }
    const roomIndex = floorPlan.rooms.findIndex(room => room.roomNumber === req.params.roomNumber);
    if (roomIndex === -1) {
      return res.status(404).json({ message: 'Room not found' });
    }
    floorPlan.rooms[roomIndex] = { ...floorPlan.rooms[roomIndex], ...req.body };
    await floorPlan.save();
    res.json(floorPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});




// GET all users
app.get('/all-users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET a single user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new user
app.post('/add-user', async (req, res) => {
  try {
    const { username, email, contactNumber, password } = req.body;
    if (!username || !email || !contactNumber || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // prevent duplicate email
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const user = new User({ username, email, contactNumber, password });
    await user.save();
    // don't return password
    const safeUser = { _id: user._id, username: user.username, email: user.email, contactNumber: user.contactNumber, createdAt: user.createdAt };
    res.status(201).json({ message: 'User created', user: safeUser });
  } catch (err) {
    console.error('add-user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update a user by ID
app.put('/update-user/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH update a user by ID
app.patch('/update-user/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/delete-floorplan/:id', async (req, res) => {
  try {
    const deletedFloorPlan = await FloorPlan.findByIdAndDelete(req.params.id);
    if (deletedFloorPlan) {
      res.json({ message: 'Floor plan deleted successfully' });
    } else {
      res.status(404).json({ message: 'Floor plan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE a user by ID
app.delete('/delete-user/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//************************************************************************************
app.get("/*", (req, res) => {
  res.send("You are on the wrong route");
});
