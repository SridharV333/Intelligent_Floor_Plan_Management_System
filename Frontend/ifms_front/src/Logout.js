import React from 'react';
import { Container, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // optional: notify backend if you have a session/token endpoint
      await axios.post('http://localhost:8000/logout').catch(() => {});
    } catch (e) {
      // ignore network errors for logout
    } finally {
      // clear local auth state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // redirect to login
      navigate('/login');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>Logout</Typography>
      <Button variant="contained" color="primary" onClick={handleLogout} sx={{ backgroundColor: '#021323' }}>
        Sign Out
      </Button>
    </Container>
  );
}

export default Logout;