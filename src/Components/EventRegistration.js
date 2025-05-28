import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import StudentNav from './NavBar/StudentNav';
import {
  Container,
  Paper,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Box,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function EventRegistration() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [message, setMessage] = useState('');
  const [messageSeverity, setMessageSeverity] = useState('info');
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const token = localStorage.getItem('token');
  console.log('🔑 Token from localStorage:', token);
  console.log('🔍 Token content:', JSON.stringify(jwtDecode(token), null, 2));
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };


  const getStudentIdFromToken = () => {
    try {
      const decoded = jwtDecode(token);
      console.log('✅ Decoded token:', decoded);
      return decoded?.id || null;
    } catch (error) {
      console.error('❌ Invalid token:', error);
      return null;
    }
  };

  const studentId = getStudentIdFromToken();
  console.log('🎓 Student ID:', studentId);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('📡 Fetching all events...');
        const res = await axios.get('http://localhost:8080/events/all', config);
        console.log('📦 Fetched events:', res.data);
        setEvents(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch events:', err.response?.data || err.message);
        setMessage('Failed to load events.');
        setMessageSeverity('error');
      }
    };

    const fetchRegisteredEvents = async () => {
      try {
        console.log('📡 Fetching registered events...');
        const res = await axios.get(`http://localhost:8080/students/${studentId}`, config);
        const registered = res.data.events.map((event) => event.id);
        console.log('🎯 Registered event IDs:', registered);
        setRegisteredEvents(registered);
      } catch (err) {
        console.error('❌ Could not fetch registered events:', err.response?.data || err.message);
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

    if (registeredEvents.includes(parseInt(selectedEventId))) {
      setMessage('You have already registered for this event.');
      setMessageSeverity('warning');
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:8080/students/${studentId}/events/${selectedEventId}/register`,
        {},
        config
      );
      console.log('✅ Registration success:', res.data);
      setMessage(res.data);
      setMessageSeverity('success');
      setRegisteredEvents((prev) => [...prev, parseInt(selectedEventId)]);
    } catch (err) {
      console.error('❌ Registration failed:', err.response?.data || err.message);
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
                    <em>-- Select an event --</em>
                  </MenuItem>
                  {events.map((event) => (
                    <MenuItem key={event.id} value={event.id}>
                      {event.title} - {"Start date: "+ event.startDate + " - End Date: " + event.endDate} 
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* <Grid item>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Filter by date (optional)"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid> */}

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