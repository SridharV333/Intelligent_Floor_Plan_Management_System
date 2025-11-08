import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1}}>
      <AppBar position="static" sx={{height:'30%'}}>
        <Toolbar sx={{background:"#021323", color:"white", fontWeight:'bold'}}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight:'bold'}}>
            Floor Plan Management System
          </Typography>
          <Button color="inherit" component={Link} to="/about">About Us</Button>
          <Button color="inherit" component={Link} to="/contact">Contact Us</Button>
          <Button color="inherit" component={Link} to="/login">Login</Button>
          <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
          <Avatar alt="User Avatar" src="/avatar.png" />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
