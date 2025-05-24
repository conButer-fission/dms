import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

function Dashboard() {
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    upcomingAppointments: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch today's appointments
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        console.log('Fetching appointments for date:', formattedDate);
        
        const response = await fetch(
          `http://localhost:5000/api/appointments/date/${formattedDate}`
        );
        const todayData = await response.json();
        console.log('Today\'s appointments data:', todayData);
        setTodayAppointments(todayData);

        // Fetch total patients
        const patientsResponse = await fetch('http://localhost:5000/api/patients');
        const patientsData = await patientsResponse.json();
        console.log('Total patients:', patientsData.length);

        // Fetch upcoming appointments
        const upcomingResponse = await fetch('http://localhost:5000/api/appointments/upcoming');
        const upcomingData = await upcomingResponse.json();
        console.log('Upcoming appointments:', upcomingData);

        setStats({
          totalPatients: patientsData.length,
          todayAppointments: todayData.length,
          upcomingAppointments: upcomingData.length,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Total Patients
            </Typography>
            <Typography variant="h4">{stats.totalPatients}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Today's Appointments
            </Typography>
            <Typography variant="h4">{stats.todayAppointments}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Appointments
            </Typography>
            <Typography variant="h4">{stats.upcomingAppointments}</Typography>
          </Paper>
        </Grid>

        {/* Today's Appointments */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Today's Schedule
            </Typography>
            <List>
              {todayAppointments.map((appointment, index) => (
                <React.Fragment key={appointment._id}>
                  <ListItem>
                    <ListItemText
                      primary={`${appointment.time} - ${appointment.patient.firstName} ${appointment.patient.lastName}`}
                      secondary={`${appointment.type} - ${appointment.duration} minutes`}
                    />
                  </ListItem>
                  {index < todayAppointments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
              {todayAppointments.length === 0 && (
                <ListItem>
                  <ListItemText primary="No appointments scheduled for today" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard; 