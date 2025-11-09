import React, { useState, useContext } from 'react';
import { Container, TextField, Button, Typography, Grid, Alert } from '@mui/material';
import axios from './axiosConfig';

import { useNavigate } from 'react-router-dom';
import { AuthContext } from './App';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await axios.post('http://localhost:8000/login', { email, password });

            // Backend returns: { message, user, token }
            const { user, token } = res.data;
            localStorage.setItem('ifms_user', JSON.stringify(user));
            localStorage.setItem('ifms_token', token);


            if (!user || !token) {
                throw new Error('Invalid response from server');
            }

            // Store in localStorage for persistence
            localStorage.setItem('ifms_user', JSON.stringify(user));
            localStorage.setItem('ifms_token', token);

            // Update global context
            setUser(user);

            alert('Login successful');
            navigate('/home');
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Invalid credentials';
            setError(msg);
        }
    };

    return (
        <Container sx={{ mt: 6, maxWidth: 450 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                Login to Intelligent Floor Plan Management
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleLogin}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ backgroundColor: '#021323', textTransform: 'none', px: 5 }}
                        >
                            Login
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}

export default Login;
