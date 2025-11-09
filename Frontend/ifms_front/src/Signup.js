import React, { useState, useContext } from 'react';
import { Container, TextField, Button, Typography, Grid, Alert } from '@mui/material';
import axios from './axiosConfig';

import { useNavigate } from 'react-router-dom';
import { AuthContext } from './App';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !contactNumber || !password) {
      setError('Please fill all fields');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8000/signup', {
        username,
        email,
        contactNumber,
        password,
      });

      const { user } = res.data;
      if (!user) {
        throw new Error('Signup response invalid');
      }

      // For signup, you can choose to auto-login or redirect to login page
      // Option 1: Auto-login user (preferred for smooth UX)
      localStorage.setItem('ifms_user', JSON.stringify(user));
      localStorage.setItem('ifms_token', res.data.token || '');

      setUser(user);

      alert('Signup successful!');
      navigate('/home');

    } catch (err) {
      console.error('Signup error:', err);
      const msg = err.response?.data?.message || 'Signup failed. Please try again.';
      setError(msg);
    }
  };

  return (
    <Container sx={{ mt: 6, maxWidth: 500 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
        Create a New Account
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSignup}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Contact Number"
              fullWidth
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: '#021323', textTransform: 'none', px: 5 }}
            >
              Sign Up
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default Signup;
