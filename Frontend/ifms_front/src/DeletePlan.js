import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, IconButton, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function DeletePlan() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const res = await axios.get('http://localhost:8000/floorplans');
    setPlans(res.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this floor plan?')) return;
    try {
      await axios.delete(`http://localhost:8000/delete-floorplan/${id}`);
      fetchPlans();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Delete Floor Plan</Typography>
      <List>
        {plans.map(p => (
          <React.Fragment key={p._id}>
            <ListItem
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(p._id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={p.name} secondary={p.description} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
}

export default DeletePlan;