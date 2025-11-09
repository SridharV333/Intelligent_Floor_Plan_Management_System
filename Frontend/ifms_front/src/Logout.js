import React, { useContext, useState } from 'react';
import { Container, Button, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './App';
import axios from './axiosConfig';


function Logout() {
  const { setUser } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('ifms_token');

  const handleLogout = async () => {
    try {
      // Optional backend notification (ignore if not implemented)
      await axios.post('http://localhost:8000/logout', {}, {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    } catch {
      // ignore logout API failures
    } finally {
      // Clear all local session data
      localStorage.removeItem('ifms_user');
      localStorage.removeItem('ifms_token');
      setUser(null);

      setMessage('You have been logged out successfully.');
      setTimeout(() => navigate('/login'), 1500);
    }
  };

  return (
    <Container sx={{ mt: 6, maxWidth: 500, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Logout
      </Typography>

      {message && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Typography variant="body1" sx={{ mb: 3 }}>
        Click the button below to sign out of your account.
      </Typography>

      <Button
        variant="contained"
        sx={{ backgroundColor: '#021323', textTransform: 'none', px: 5 }}
        onClick={handleLogout}
      >
        Sign Out
      </Button>
    </Container>
  );
}

export default Logout;
