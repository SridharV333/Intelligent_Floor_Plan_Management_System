// /Desktop/Intelligent_Floor_Plan_Management_System/Frontend/ifms_front/src/Login.js
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Grid } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/login', { email, password });
      // res.data will contain user on success
      alert('Login successful');
      // Example: redirect to home
      navigate('/home');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      <form onSubmit={handleLogin}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Email" type="email" fullWidth value={email} onChange={e => setEmail(e.target.value)} required />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Password" type="password" fullWidth value={password} onChange={e => setPassword(e.target.value)} required />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#021323' }}>Login</Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default Login;