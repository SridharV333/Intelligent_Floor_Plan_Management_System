import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, Container } from '@mui/material';
import axios from 'axios';

function AddPlan() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [seatNumber, setSeatNumber] = useState(0);
    const [roomNumber, setRoomNumber] = useState(0);
    const [capacity, setCapacity] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newFloorPlan = {
                name,
                description,
                seats: [{ seatNumber, occupied: false }],
                rooms: [{ roomNumber, capacity, booked: false }],
            };

            await axios.post('http://localhost:8000/add-floorplan', newFloorPlan);

            // Clear the form fields after successful submission
            setName('');
            setDescription('');
            setSeatNumber(0);
            setRoomNumber(0);
            setCapacity(0);

            // Optionally, provide feedback to the user about successful submission
            alert('Floor plan added successfully!');
        } catch (error) {
            console.error('Error adding floor plan:', error);
            // Optionally, provide feedback to the user about the error
            alert('Error adding floor plan. Please try again.');
        }
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom sx={{ marginTop: '30px' }}>
                Add New Floor Plan
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            label="Name"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Description"
                            fullWidth
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Seat Number"
                            fullWidth
                            type="number"
                            value={seatNumber}
                            onChange={(e) => setSeatNumber(Number(e.target.value))}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Room Number"
                            fullWidth
                            type="number"
                            value={roomNumber}
                            onChange={(e) => setRoomNumber(Number(e.target.value))}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Capacity"
                            fullWidth
                            type="number"
                            value={capacity}
                            onChange={(e) => setCapacity(Number(e.target.value))}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            style={{ backgroundColor: '#021323', color: 'white' }}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}

export default AddPlan;

