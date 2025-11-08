import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, FormControl, InputLabel, Select, MenuItem, List, ListItem, ListItemText, Button } from '@mui/material';

function BookRoom() {
  const [plans, setPlans] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    const res = await axios.get('http://localhost:8000/floorplans');
    setPlans(res.data);
  };

  const toggleBooking = async (roomNumber) => {
    if (!selectedId) return;
    const plan = plans.find(p => p._id === selectedId);
    if (!plan) return;
    const updated = { ...plan };
    updated.rooms = (updated.rooms || []).map(r => r.roomNumber === roomNumber ? { ...r, booked: !r.booked } : r);
    try {
      await axios.put(`http://localhost:8000/update-floorplan/${selectedId}`, updated);
      await fetchPlans();
      alert('Room booking toggled');
    } catch (err) {
      console.error(err);
      alert('Booking failed');
    }
  };

  const selectedPlan = plans.find(p => p._id === selectedId);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Book / Unbook Room</Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="plan-select">Select Plan</InputLabel>
        <Select labelId="plan-select" value={selectedId || ''} label="Select Plan" onChange={e => setSelectedId(e.target.value)}>
          <MenuItem value=""><em>None</em></MenuItem>
          {plans.map(p => <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>)}
        </Select>
      </FormControl>

      {selectedPlan && (
        <>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Rooms</Typography>
          <List>
            {(selectedPlan.rooms || []).map(r => (
              <ListItem key={r.roomNumber} secondaryAction={
                <Button variant="contained" color={r.booked ? 'secondary' : 'primary'} onClick={() => toggleBooking(r.roomNumber)}>
                  {r.booked ? 'Unbook' : 'Book'}
                </Button>
              }>
                <ListItemText primary={`Room ${r.roomNumber} — capacity ${r.capacity}`} secondary={r.booked ? 'Booked' : 'Available'} />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Container>
  );
}

export default BookRoom;