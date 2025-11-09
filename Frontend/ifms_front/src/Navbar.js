import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import { useTheme } from '@mui/material/styles';
import { AuthContext } from './App';

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // reload user if needed (for example, page reloads or cross-tab updates)
  useEffect(() => {
    const stored = localStorage.getItem('ifms_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location, setUser]);

  const handleLogout = () => {
    localStorage.removeItem('ifms_user');
    localStorage.removeItem('ifms_token');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const updateStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* ✅ Offline status banner with smooth animation */}
      <Slide direction="down" in={isOffline} mountOnEnter unmountOnExit>
        <Box
          sx={{
            width: '100%',
            backgroundColor: '#ffcc00',
            textAlign: 'center',
            color: 'black',
            fontWeight: 'bold',
            py: 1,
            position: 'fixed',
            top: 0,
            zIndex: theme.zIndex.appBar + 1,
            boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          ⚠️ You are offline — changes will be saved locally and synced later.
        </Box>
      </Slide>

      {/* Main Navbar */}
      <AppBar
        position="fixed"
        sx={{
          top: isOffline ? '36px' : 0, // push down if offline banner visible
          background: '#021323',
          color: 'white',
          transition: 'top 0.3s ease',
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
            onClick={() => navigate('/home')}
          >
            Intelligent Floor Plan Management System
          </Typography>

          {user ? (
            <>
              <Typography sx={{ mr: 2 }}>
                {user.username || user.name || user.email}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                SignUp
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Add some spacing to prevent content overlap with fixed AppBar */}
      <Toolbar />
    </Box>
  );
}
