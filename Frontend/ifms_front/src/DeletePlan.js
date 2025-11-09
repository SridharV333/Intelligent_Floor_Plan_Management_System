import React, { useEffect, useState, useContext } from 'react';
import axios from './axiosConfig';

import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Alert,
  Button,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { AuthContext } from './App';

function DeletePlan() {
  const [plans, setPlans] = useState([]);
  const [message, setMessage] = useState('');
  const [recentlyDeleted, setRecentlyDeleted] = useState(null);
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
      console.error('Error fetching plans:', err);
      setMessage('Failed to load floor plans.');
    }
  };

  const handleDelete = async (id) => {
    if (!user) return alert('You must be logged in to delete plans.');

    const planToDelete = plans.find((p) => p._id === id);
    if (!planToDelete) return;

    if (!window.confirm(`Are you sure you want to delete "${planToDelete.name}"?`)) return;

    try {
      await axios.delete(`http://localhost:8000/delete-floorplan/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(`"${planToDelete.name}" deleted successfully.`);
      setRecentlyDeleted(planToDelete);

      // Optimistic update (faster UI response)
      setPlans((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Failed to delete floor plan.');
    }
  };

  const handleUndo = async () => {
    if (!recentlyDeleted) return;

    try {
      // Recreate the deleted plan
      await axios.post('http://localhost:8000/add-floorplan', recentlyDeleted, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlans((prev) => [...prev, recentlyDeleted]);
      setMessage(`"${recentlyDeleted.name}" restored successfully.`);
      setRecentlyDeleted(null);
    } catch (err) {
      console.error('Undo failed:', err);
      setMessage('Failed to restore the deleted plan.');
    }
  };

  return (
    <Container sx={{ mt: 4, maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Delete Floor Plan
      </Typography>

      {message && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {recentlyDeleted && (
        <Box sx={{ mb: 2 }}>
          <Alert
            severity="warning"
            action={
              <Button color="inherit" size="small" onClick={handleUndo}>
                Undo
              </Button>
            }
          >
            Deleted "{recentlyDeleted.name}" — You can undo this action.
          </Alert>
        </Box>
      )}

      <List>
        {plans.length === 0 && (
          <Typography variant="body1" color="text.secondary">
            No floor plans found.
          </Typography>
        )}
        {plans.map((p) => (
          <React.Fragment key={p._id}>
            <ListItem
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  color="error"
                  onClick={() => handleDelete(p._id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={p.name}
                secondary={p.description || 'No description available'}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
}

export default DeletePlan;
