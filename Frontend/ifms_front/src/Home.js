import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import add from './add.jpg';
import view from './view.webp';
import del from './delete.jpg';
import room from './room.webp';

function Home() {
  return (
    <Box className="home-container">
      {/* Header Section */}
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        className="home-title"
      >
        Intelligent Floor Plan Management System
      </Typography>

      {/* Dashboard Section */}
      <Box className="dashboard-container">
        <Typography variant="h6" className="section-title">
          Floor Plan Operations
        </Typography>

        <Grid container spacing={3} justifyContent="center" sx={{ mt: 1 }}>
          {/* Add Plan */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              component={Link}
              to="/add-plan"
              className="dashboard-card"
              sx={{ textDecoration: 'none' }}
            >
              <img src={add} alt="Add Plan" className="dashboard-img" />
              <CardContent>
                <Typography variant="h6" className="card-title">
                  Add Floor Plan
                </Typography>
                <Typography variant="body2" className="card-desc">
                  Create a new floor map and define seats and rooms.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Modify Plan */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              component={Link}
              to="/modify-plan"
              className="dashboard-card"
              sx={{ textDecoration: 'none' }}
            >
              <img src={view} alt="Modify Plan" className="dashboard-img" />
              <CardContent>
                <Typography variant="h6" className="card-title">
                  Modify Floor Plan
                </Typography>
                <Typography variant="body2" className="card-desc">
                  Update existing floor layouts and manage conflicts.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Delete Plan */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              component={Link}
              to="/delete-plan"
              className="dashboard-card"
              sx={{ textDecoration: 'none' }}
            >
              <img src={del} alt="Delete Plan" className="dashboard-img" />
              <CardContent>
                <Typography variant="h6" className="card-title">
                  Delete Floor Plan
                </Typography>
                <Typography variant="body2" className="card-desc">
                  Remove outdated floor maps from the system.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Book Room */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              component={Link}
              to="/book-room"
              className="dashboard-card"
              sx={{ textDecoration: 'none' }}
            >
              <img src={room} alt="Book Room" className="dashboard-img" />
              <CardContent>
                <Typography variant="h6" className="card-title">
                  Book a Room
                </Typography>
                <Typography variant="body2" className="card-desc">
                  Find and book available meeting rooms efficiently.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Home;
