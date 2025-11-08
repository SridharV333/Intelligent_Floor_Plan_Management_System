// ...existing code...
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Grid } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!username || !email || !contactNumber || !password) {
      alert('Please fill all fields');
      return;
    }

    try {
      // use explicit backend URL to avoid proxy confusion while debugging
      const res = await axios.post('http://localhost:8000/add-user', {
        username,
        email,
        contactNumber,
        password
      });

      console.log('Signup response:', res.status, res.data);
      if (res.status === 201 || res.status === 200) {
        alert('Signup successful');
        setUsername('');
        setEmail('');
        setContactNumber('');
        setPassword('');
        navigate('/login');
      } else {
        alert(res.data?.message || 'Signup returned unexpected status');
      }
    } catch (err) {
      console.error('Signup error:', err);
      if (err.response) {
        console.error('Server responded:', err.response.status, err.response.data);
        alert(err.response.data?.message || `Signup failed (${err.response.status})`);
      } else if (err.request) {
        console.error('No response received:', err.request);
        alert('No response from server. Ensure backend is running on http://localhost:8000');
      } else {
        alert('Signup error: ' + err.message);
      }
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Sign Up</Typography>
      <form onSubmit={handleSignup}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Username" fullWidth value={username} onChange={e => setUsername(e.target.value)} required />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Email" type="email" fullWidth value={email} onChange={e => setEmail(e.target.value)} required />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Contact Number" fullWidth value={contactNumber} onChange={e => setContactNumber(e.target.value)} required />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Password" type="password" fullWidth value={password} onChange={e => setPassword(e.target.value)} required />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#021323' }}>Sign Up</Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default Signup;
// ...existing code...