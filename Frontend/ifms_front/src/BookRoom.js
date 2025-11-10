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
  TextField,
  Card,
  CardContent,
} from '@mui/material';
import { AuthContext } from './App';

function BookRoom() {
  const { user } = useContext(AuthContext);
  const [plans, setPlans] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [participants, setParticipants] = useState('');
  const [suggestedRoom, setSuggestedRoom] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [preferredRoom, setPreferredRoom] = useState(null);
  const [message, setMessage] = useState('');

  // Load all plans on mount
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

  // Select floor plan
  const handleSelectPlan = (id) => {
    const plan = plans.find((p) => p._id === id);
    setSelectedId(id);
    setSelectedPlan(plan || null);
    setSuggestedRoom(null);
  };

  // Suggest the best-fit room
  const handleSuggest = async () => {
    if (!participants || !selectedId)
      return setMessage('Please enter number of participants and select a floor plan.');

    try {
      const res = await axios.post(`/floorplans/${selectedId}/suggest-room`, {
        participants: Number(participants),
      });
      setSuggestedRoom(res.data.suggestedRoom);
      setMessage('Optimal room suggested based on capacity and availability.');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Room suggestion failed.');
    }
  };

  // Book selected room
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

  // Unbook selected room
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

  const refreshData = async () => {
    const res = await axios.get('/floorplans');
    setPlans(res.data);
    const plan = res.data.find((p) => p._id === selectedId);
    setSelectedPlan(plan || null);
    fetchUserBookings();
  };

  // Fetch user-specific bookings
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
              bookingCount: room.bookingCount || 0,
            });
          }
        });
      });

      setMyBookings(myRooms);

      // Determine user's preferred room (based on frequency)
      if (myRooms.length > 0) {
        const preferred = [...myRooms].sort(
          (a, b) => (b.bookingCount || 0) - (a.bookingCount || 0)
        )[0];
        setPreferredRoom(preferred);
      }
    } catch (err) {
      console.error('Failed to fetch user bookings:', err);
    }
  };

  useEffect(() => {
    if (user) fetchUserBookings();
  }, [plans]);

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" align="center">
        Meeting Room Optimization
      </Typography>

      {message && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      {/* Select Plan */}
      <FormControl fullWidth sx={{ mb: 2 }}>
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

      {/* Suggest Room Section */}
      <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
        <TextField
          label="Number of Participants"
          type="number"
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: '#021323', color: 'white', height: '56px' }}
          onClick={handleSuggest}
        >
          Suggest Room
        </Button>
      </Box>

      {/* Suggested Room Display */}
      {suggestedRoom && (
        <Card
          sx={{
            mb: 3,
            backgroundColor: 'rgba(0, 128, 0, 0.1)',
            border: '1px solid #4caf50',
            borderRadius: '12px',
          }}
        >
          <CardContent>
            <Typography variant="h6">Suggested Room:</Typography>
            <Typography>Room Number: {suggestedRoom.roomNumber}</Typography>
            <Typography>Capacity: {suggestedRoom.capacity}</Typography>
            <Typography>Previous Bookings: {suggestedRoom.bookingCount || 0}</Typography>
            <Button
              variant="contained"
              sx={{ mt: 2, backgroundColor: '#021323' }}
              onClick={() => bookRoom(suggestedRoom.roomNumber)}
            >
              Book This Room
            </Button>
          </CardContent>
        </Card>
      )}

      {/* All Rooms in Selected Plan */}
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

      {/* Preferred Room Section */}
      {preferredRoom && (
        <Card
          sx={{
            mt: 4,
            backgroundColor: 'rgba(255, 215, 0, 0.1)',
            border: '1px solid #ffb300',
            borderRadius: '12px',
          }}
        >
          <CardContent>
            <Typography variant="h6" color="text.primary">
              Preferred Room (Based on Your Booking History)
            </Typography>
            <Typography>
              Room {preferredRoom.roomNumber} on {preferredRoom.floorName} floor — Capacity:{' '}
              {preferredRoom.capacity}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Bookings: {preferredRoom.bookingCount || 0}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default BookRoom;
