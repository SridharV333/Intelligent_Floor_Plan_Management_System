// ...existing code...
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const loadUser = () => {
    const raw = localStorage.getItem('user');
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
    // storage event for cross-tab updates
    const onStorage = (e) => {
      if (e.key === 'user') loadUser();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // also refresh user when route changes (handles same-tab login that sets localStorage then navigates)
  useEffect(() => {
    loadUser();
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ height: '30%' }}>
        <Toolbar sx={{ background: "#021323", color: "white", fontWeight: 'bold' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Floor Plan Management System
          </Typography>

          {user ? (
            <>
              <Typography sx={{ mr: 2 }}>
                {user.username || user.name || user.email}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>LogOut</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/signup">SignUp</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
// ...existing code...