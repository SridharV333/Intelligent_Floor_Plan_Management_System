import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, TextField, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

function ModifyPlan() {
  const [plans, setPlans] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const res = await axios.get('http://localhost:8000/floorplans');
    setPlans(res.data);
  };

  const handleSelect = (id) => {
    setSelectedId(id);
    const plan = plans.find(p => p._id === id);
    setName(plan?.name || '');
    setDescription(plan?.description || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedId) return alert('Select a plan first');
    // use PUT to update whole plan (backend compares params oddly for nested updates)
    const existing = plans.find(p => p._id === selectedId) || {};
    const payload = { ...existing, name, description };
    try {
      await axios.put(`http://localhost:8000/update-floorplan/${selectedId}`, payload);
      alert('Plan updated');
      fetchPlans();
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Modify Floor Plan</Typography>
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
          {plans.map(p => (
            <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <form onSubmit={handleUpdate}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Name" fullWidth value={name} onChange={e => setName(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Description" fullWidth value={description} onChange={e => setDescription(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#021323' }}>Save Changes</Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default ModifyPlan;