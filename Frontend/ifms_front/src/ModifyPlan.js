import React, { useEffect, useState, useContext } from 'react';
import axios from './axiosConfig';

import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Box,
  IconButton,
} from '@mui/material';
import { AuthContext } from './App';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { saveOfflineChange } from './offlineSync';

function ModifyPlan() {
  const [plans, setPlans] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rooms, setRooms] = useState([]);
  const [seats, setSeats] = useState([]);
  const [version, setVersion] = useState(1);
  const [message, setMessage] = useState('');
  const [conflictData, setConflictData] = useState(null);
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('ifms_token');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get('http://localhost:8000/floorplans', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlans(res.data);
    } catch (err) {
      console.error('Fetch failed:', err);
      setMessage('Failed to fetch floor plans');
    }
  };

  const handleSelect = (id) => {
    setSelectedId(id);
    const plan = plans.find((p) => p._id === id);
    if (plan) {
      setName(plan.name);
      setDescription(plan.description || '');
      setRooms(plan.rooms || []);
      setSeats(plan.seats || []);
      setVersion(plan.version || 1);
      setConflictData(null);
      setMessage('');
    }
  };

  const handleAddRoom = () => {
    setRooms([...rooms, { roomNumber: '', capacity: '', booked: false }]);
  };

  const handleRemoveRoom = (index) => {
    const updated = [...rooms];
    updated.splice(index, 1);
    setRooms(updated);
  };

  const handleRoomChange = (index, field, value) => {
    const updated = [...rooms];
    updated[index][field] = value;
    setRooms(updated);
  };

  const handleAddSeat = () => {
    setSeats([...seats, { seatNumber: '', occupied: false }]);
  };

  const handleRemoveSeat = (index) => {
    const updated = [...seats];
    updated.splice(index, 1);
    setSeats(updated);
  };

  const handleSeatChange = (index, value) => {
    const updated = [...seats];
    updated[index].seatNumber = value;
    setSeats(updated);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedId) return alert('Select a plan first');

    // 🔹 1. Validation: check for duplicate room numbers
    const roomNumbers = rooms.map((r) => Number(r.roomNumber));
    const uniqueRoomNumbers = new Set(roomNumbers);
    if (uniqueRoomNumbers.size !== roomNumbers.length) {
      setMessage('Error: Duplicate room numbers found. Please fix before saving.');
      return;
    }

    // 🔹 2. Construct payload with version control
    const payload = {
      name,
      description,
      rooms: rooms.map((r) => ({
        roomNumber: Number(r.roomNumber),
        capacity: Number(r.capacity),
        booked: r.booked || false,
      })),
      seats: seats.map((s) => ({
        seatNumber: Number(s.seatNumber),
        occupied: s.occupied || false,
      })),
      version, // 🆕 Send current version from DB
    };

    try {
      // 🔹 3. PUT request to backend with JWT auth
      const res = await axios.put(
        `http://localhost:8000/update-floorplan/${selectedId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 🔹 4. If success
      setMessage('Plan updated successfully!');
      setConflictData(null);
      fetchPlans(); // Refresh data to get new version
    } catch (err) {
      // 🔹 5. Handle version conflict (HTTP 409)
      if (!navigator.onLine || err.code === 'ERR_NETWORK') {
        saveOfflineChange(selectedId, payload);
        setMessage('You are offline. Changes saved locally and will sync later.');
      }
      else if (err.response && err.response.status === 409) {
        const serverVersion = err.response.data.currentVersion;
        setMessage(
          `Conflict detected: Another admin updated this plan (Server version: ${serverVersion}). Please refresh to get the latest version.`
        );
      } else {
        console.error('Update error:', err);
        setMessage('Update failed due to server error.');
      }
    }
  };


  return (
    <Container sx={{ mt: 4, maxWidth: 800 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Modify Floor Plan
      </Typography>

      {message && (
        <Alert severity={message.includes('Error') || message.includes('fail') ? 'error' : 'info'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="plan-select-label">Select Plan</InputLabel>
        <Select
          labelId="plan-select-label"
          value={selectedId}
          label="Select Plan"
          onChange={(e) => handleSelect(e.target.value)}
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

      {selectedId && (
        <form onSubmit={handleUpdate}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>

            {/* ---------- Rooms Section ---------- */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Rooms</Typography>
              {rooms.map((room, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                  <TextField
                    label="Room Number"
                    type="number"
                    value={room.roomNumber}
                    onChange={(e) => handleRoomChange(index, 'roomNumber', e.target.value)}
                    sx={{ width: '40%' }}
                  />
                  <TextField
                    label="Capacity"
                    type="number"
                    value={room.capacity}
                    onChange={(e) => handleRoomChange(index, 'capacity', e.target.value)}
                    sx={{ width: '40%' }}
                  />
                  <IconButton color="error" onClick={() => handleRemoveRoom(index)}>
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddRoom}
                sx={{ mb: 2 }}
              >
                Add Room
              </Button>
            </Grid>

            {/* ---------- Seats Section ---------- */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Seats</Typography>
              {seats.map((seat, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                  <TextField
                    label="Seat Number"
                    type="number"
                    value={seat.seatNumber}
                    onChange={(e) => handleSeatChange(index, e.target.value)}
                    sx={{ width: '80%' }}
                  />
                  <IconButton color="error" onClick={() => handleRemoveSeat(index)}>
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddSeat}
                sx={{ mb: 2 }}
              >
                Add Seat
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                sx={{ backgroundColor: '#021323', textTransform: 'none' }}
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Container>
  );
}

export default ModifyPlan;
