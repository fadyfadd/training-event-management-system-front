import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from './axiosInstance';
import StudentNav from './NavBar/StudentNav';
import {
  Container,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Box,
} from '@mui/material';
import { useSelector } from 'react-redux';

function EventRegistration() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [message, setMessage] = useState('');
  const [messageSeverity, setMessageSeverity] = useState('info');
  const [registeredEvents, setRegisteredEvents] = useState([]);

  // const token = localStorage.getItem('token');
  const {token} = useSelector((state) => state.auth);
  const studentId = (() => {
    try {
      return jwtDecode(token)?.id || null;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  })();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axiosInstance.get('/events/all');
        const now = new Date();

        setEvents(res.data);

      } catch (err) {
        setMessage('Failed to load events.');
        setMessageSeverity('error');
      }
    };

    const fetchRegisteredEvents = async () => {
      try {
        const res = await axiosInstance.get(`/students/${studentId}`);
        const registered = res.data.events.map((event) => event.id);
        setRegisteredEvents(registered);
      } catch (err) {
        console.error('Could not fetch registered events:', err);
      }
    };

    if (studentId) {
      fetchEvents();
      fetchRegisteredEvents();
    }
  }, [studentId]);

  const handleRegister = async () => {
    if (!selectedEventId) {
      setMessage('Please select an event.');
      setMessageSeverity('error');
      return;
    }

    const selectedEvent = events.find((event) => event.id === parseInt(selectedEventId));

if (new Date(selectedEvent?.startDate) <= new Date()) {
  setMessage('You cannot register for an event that has already started.');
  setMessageSeverity('error');
  return;
}


    if (registeredEvents.includes(parseInt(selectedEventId))) {
      setMessage('You have already registered for this event.');
      setMessageSeverity('warning');
      return;
    }

    try {
      const res = await axiosInstance.post(`/students/${studentId}/events/${selectedEventId}/register`);
      setMessage(res.data);
      setMessageSeverity('success');
      setRegisteredEvents((prev) => [...prev, parseInt(selectedEventId)]);
    } catch (err) {
      setMessage('Registration failed: ' + (err.response?.data || err.message));
      setMessageSeverity('error');
    }
  };

  return (
    <>
      <StudentNav />
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Event Registration
          </Typography>

          {message && (
            <Typography color={messageSeverity} sx={{ mb: 2 }}>
              {message}
            </Typography>
          )}

          <Grid container spacing={3} direction="column">
            <Grid item>
              <FormControl fullWidth>
                <InputLabel>Select an event</InputLabel>
                <Select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  label="Select an event"
                >
                  <MenuItem value="">
                    <em>-- Select an upcoming event --</em>
                  </MenuItem>
                  {events.map((event) => {
  const hasStarted = new Date(event.startDate) <= new Date();
  return (
    <MenuItem
      key={event.id}
      value={event.id}
      disabled={hasStarted}
    >
      {event.title} - Start: {event.startDate}, End: {event.endDate}
      {hasStarted && ' (Already Started)'}
    </MenuItem>
  );
})}

                </Select>
              </FormControl>
            </Grid>

            <Grid item>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleRegister}
                  disabled={!selectedEventId}
                >
                  Register
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
}

export default EventRegistration;
