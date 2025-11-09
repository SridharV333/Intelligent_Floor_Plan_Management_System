import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import map from './map.png';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import add from './add.jpg';
import view from './view.webp';
import del from './delete.jpg';
import seat from './seat.jpg';
import room from './room.webp';

function Home() {
  return (
    <div className="home-background">
      <div className="content">
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            color: "white",
            fontWeight: 'bold',
            fontSize: '3rem',
            marginTop: '20%',
            marginBottom: '25%'
          }}
        >
          Welcome To <br></br> Intelligent Floor Plan Management System
        </Typography>

        {/* <img
          src={map}
          alt="Example Image"
          className="home-image"
          style={{ marginTop: '50px' }}
        /> */}

        <div
          className="cards-container"
          style={{ marginTop: '110px', marginBottom: '40px', borderRadius: '20px' }}
        >
          <Card
            className="card"
            component={Link}
            to="/add-plan"
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none' }}
          >
            <CardMedia component="img" height="140" image={add} alt="Add Floor Plan" />
            <CardContent>
              <Typography variant="h6">Add Floor Map</Typography>
            </CardContent>
          </Card>

          <Card
            className="card"
            component={Link}
            to="/modify-plan"
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none' }}
          >
            <CardMedia component="img" height="140" image={view} alt="Modify Floor Plan" />
            <CardContent>
              <Typography variant="h6">Modify Floor Map</Typography>
            </CardContent>
          </Card>

          <Card
            className="card"
            component={Link}
            to="/delete-plan"
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none' }}
          >
            <CardMedia component="img" height="140" image={del} alt="Delete Floor Plan" />
            <CardContent>
              <Typography variant="h6">Delete Floor Map</Typography>
            </CardContent>
          </Card>

          {/* Book Room card — always rendered */}
          <Card
            className="card"
            component={Link}
            to="/book-room"
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none' }}
          >
            <CardMedia component="img" height="140" image={room} alt="Book a Room" />
            <CardContent>
              <Typography variant="h6">Book a Room</Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Home;
