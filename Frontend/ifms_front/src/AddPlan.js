import React, { useState, useContext, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Grid,
  Container,
  Alert,
} from '@mui/material';
import axios from './axiosConfig';

import { AuthContext } from './App';

function AddPlan() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [message, setMessage] = useState('');
  const [offlineQueue, setOfflineQueue] = useState([]);
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('ifms_token');

  // Load any unsynced floor plans (for offline use)
  useEffect(() => {
    const saved = localStorage.getItem('offline_floorplans');
    if (saved) setOfflineQueue(JSON.parse(saved));
  }, []);

  // Sync offline data when back online
  useEffect(() => {
    window.addEventListener('online', syncOfflinePlans);
    return () => window.removeEventListener('online', syncOfflinePlans);
  }, [offlineQueue]);

  const syncOfflinePlans = async () => {
    if (offlineQueue.length === 0) return;

    setMessage('Syncing offline floor plans...');
    for (const plan of offlineQueue) {
      try {
        await axios.post('http://localhost:8000/add-floorplan', plan, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error('Sync failed for plan:', plan.name, err);
        return setMessage('Some floor plans failed to sync.');
      }
    }
    setOfflineQueue([]);
    localStorage.removeItem('offline_floorplans');
    setMessage('Offline floor plans synced successfully!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const newFloorPlan = {
      name,
      description,
      seats: [{ seatNumber: Number(seatNumber), occupied: false }],
      rooms: [{ roomNumber: Number(roomNumber), capacity: Number(capacity), booked: false }],
      version: 0,
    };

    // If offline, save to localStorage
    if (!navigator.onLine) {
      const updatedQueue = [...offlineQueue, newFloorPlan];
      setOfflineQueue(updatedQueue);
      localStorage.setItem('offline_floorplans', JSON.stringify(updatedQueue));
      setMessage('You are offline. Floor plan saved locally and will sync automatically.');
      clearForm();
      return;
    }

    // Online submission
    try {
      await axios.post('http://localhost:8000/add-floorplan', newFloorPlan, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Floor plan added successfully!');
      clearForm();
    } catch (error) {
      console.error('Error adding floor plan:', error);
      setMessage(error.response?.data?.message || 'Error adding floor plan.');
    }
  };

  const clearForm = () => {
    setName('');
    setDescription('');
    setSeatNumber('');
    setRoomNumber('');
    setCapacity('');
  };

  return (
    <Container sx={{ mt: 4, maxWidth: 600 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Add New Floor Plan
      </Typography>

      {message && (
        <Alert severity={message.includes('Error') ? 'error' : 'info'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              fullWidth
              required
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
          <Grid item xs={6}>
            <TextField
              label="Seat Number"
              fullWidth
              type="number"
              value={seatNumber}
              onChange={(e) => setSeatNumber(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Room Number"
              fullWidth
              type="number"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Capacity"
              fullWidth
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: '#021323', textTransform: 'none', px: 5 }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default AddPlan;
