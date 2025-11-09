import React, { useEffect, useState, useContext } from 'react';
import axios from './axiosConfig';
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Button,
  Alert,
  Box,
  Divider,
} from '@mui/material';
import { AuthContext } from './App';

function BookRoom() {
  const { user } = useContext(AuthContext);
  const [plans, setPlans] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch all floor plans on load
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get('/floorplans');
      setPlans(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Failed to load floor plans.');
    }
  };

  const handleSelectPlan = (id) => {
    const plan = plans.find((p) => p._id === id);
    setSelectedId(id);
    setSelectedPlan(plan || null);
  };

  const refreshData = async () => {
    const res = await axios.get('/floorplans');
    setPlans(res.data);
    const plan = res.data.find((p) => p._id === selectedId);
    setSelectedPlan(plan || null);
    fetchUserBookings();
  };

  const bookRoom = async (roomNumber) => {
    try {
      await axios.post(`/floorplans/${selectedId}/book-room/${roomNumber}`, {
        userId: user._id,
        durationMinutes: 60,
      });
      setMessage(`Room ${roomNumber} booked successfully.`);
      refreshData();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Booking failed.');
    }
  };

  const unbookRoom = async (roomNumber) => {
    try {
      await axios.post(`/floorplans/${selectedId}/unbook-room/${roomNumber}`);
      setMessage(`Room ${roomNumber} unbooked successfully.`);
      refreshData();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Unbooking failed.');
    }
  };

  const fetchUserBookings = async () => {
    try {
      const res = await axios.get('/floorplans');
      const allPlans = res.data;

      const myRooms = [];
      allPlans.forEach((plan) => {
        plan.rooms.forEach((room) => {
          if (room.bookedBy === user._id) {
            myRooms.push({
              floorName: plan.name,
              roomNumber: room.roomNumber,
              capacity: room.capacity,
              bookedUntil: room.bookedUntil,
            });
          }
        });
      });

      setMyBookings(myRooms);
    } catch (err) {
      console.error('Failed to fetch user bookings:', err);
    }
  };

  useEffect(() => {
    if (user) fetchUserBookings();
  }, [plans]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Book a Room
      </Typography>

      {message && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {/* Floor Plan Selection */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="plan-select-label">Select Floor Plan</InputLabel>
        <Select
          labelId="plan-select-label"
          value={selectedId}
          label="Select Floor Plan"
          onChange={(e) => handleSelectPlan(e.target.value)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {plans.map((p) => (
            <MenuItem key={p._id} value={p._id}>
              {p.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Display rooms for selected plan */}
      {selectedPlan && (
        <>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Rooms in {selectedPlan.name}
          </Typography>
          <List>
            {selectedPlan.rooms.map((room) => (
              <React.Fragment key={room.roomNumber}>
                <ListItem
                  secondaryAction={
                    <Button
                      variant="contained"
                      color={room.booked ? 'secondary' : 'primary'}
                      onClick={() =>
                        room.booked
                          ? unbookRoom(room.roomNumber)
                          : bookRoom(room.roomNumber)
                      }
                    >
                      {room.booked ? 'Unbook' : 'Book'}
                    </Button>
                  }
                >
                  <ListItemText
                    primary={`Room ${room.roomNumber} — Capacity: ${room.capacity}`}
                    secondary={
                      room.booked
                        ? room.bookedBy === user._id
                          ? 'Booked by you'
                          : 'Booked by another user'
                        : 'Available'
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </>
      )}

      {/* My Bookings Section */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          My Booked Rooms
        </Typography>
        {myBookings.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            You have not booked any rooms yet.
          </Typography>
        ) : (
          <List>
            {myBookings.map((b, idx) => (
              <React.Fragment key={idx}>
                <ListItem>
                  <ListItemText
                    primary={`Room ${b.roomNumber} — Floor: ${b.floorName}`}
                    secondary={`Capacity: ${b.capacity} | Booked until: ${
                      b.bookedUntil
                        ? new Date(b.bookedUntil).toLocaleString()
                        : 'N/A'
                    }`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
}

export default BookRoom;
