import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchPatient();
    fetchPatientAppointments();
  }, [id]);

  const fetchPatient = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/patients/${id}`);
      const data = await response.json();
      setPatient(data);
    } catch (error) {
      console.error('Error fetching patient:', error);
    }
  };

  const fetchPatientAppointments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments?patient=${id}`);
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  if (!patient) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {`${patient.firstName} ${patient.lastName}`}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  <strong>Email:</strong> {patient.email}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Phone:</strong> {patient.phone}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Date of Birth:</strong>{' '}
                  {new Date(patient.dateOfBirth).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  <strong>Address:</strong>
                </Typography>
                <Typography>
                  {patient.address?.street}
                  <br />
                  {patient.address?.city}, {patient.address?.state}{' '}
                  {patient.address?.zipCode}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Medical History
            </Typography>
            <List>
              {patient.medicalHistory?.map((record, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={record.condition}
                      secondary={`Diagnosed: ${new Date(
                        record.diagnosisDate
                      ).toLocaleDateString()}`}
                    />
                  </ListItem>
                  {index < patient.medicalHistory.length - 1 && <Divider />}
                </React.Fragment>
              ))}
              {(!patient.medicalHistory || patient.medicalHistory.length === 0) && (
                <ListItem>
                  <ListItemText primary="No medical history recorded" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Appointments
            </Typography>
            <List>
              {appointments.map((appointment, index) => (
                <React.Fragment key={appointment._id}>
                  <ListItem>
                    <ListItemText
                      primary={`${new Date(
                        appointment.date
                      ).toLocaleDateString()} - ${appointment.time}`}
                      secondary={`${appointment.type} - ${appointment.status}`}
                    />
                  </ListItem>
                  {index < appointments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
              {appointments.length === 0 && (
                <ListItem>
                  <ListItemText primary="No appointments recorded" />
                </ListItem>
              )}
            </List>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/appointments/new')}
              sx={{ mt: 2 }}
            >
              Schedule New Appointment
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default PatientDetails; 