import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Box,
  TextField, Button, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import StudentNav from './NavBar/StudentNav';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from './axiosInstance';

const StudentEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [eventToUnregister, setEventToUnregister] = useState(null);

  const token = localStorage.getItem('token');

  const getUsernameFromToken = () => {
    try {
      const decoded = jwtDecode(token);
      return decoded?.sub || decoded?.username || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const username = getUsernameFromToken();

  useEffect(() => {
    const fetchStudentEvents = async () => {
      try {
        const res = await axiosInstance.get(`/events/student/${username}`);
        setEvents(res.data);
        console.log('📦 Student events:', res.data);
      } catch (error) {
        console.error('❌ Failed to fetch student events:', error);
      }
    };

    if (username) {
      fetchStudentEvents();
    }
  }, [username, token]);

  const confirmUnregister = async () => {
    if (!eventToUnregister) return;

    try {
      await axiosInstance.delete(`/events/${eventToUnregister}/unregister/${username}`);
      setEvents(events.filter(event => event.id !== eventToUnregister));
      console.log(`✅ Unregistered from event ID: ${eventToUnregister}`);
    } catch (error) {
      console.error(`❌ Failed to unregister from event ID: ${eventToUnregister}`, error);
    } finally {
      setOpenDialog(false);
      setEventToUnregister(null);
    }
  };

  const isBeforeStartDate = (startDate) => {
    return new Date(startDate) > new Date();
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <StudentNav />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Events
        </Typography>

        <TextField
          label="Search Events"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Course Name</strong></TableCell>
                <TableCell><strong>Start Date</strong></TableCell>
                <TableCell><strong>End Date</strong></TableCell>
                <TableCell><strong>Teacher</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents.map((event, index) => (
                <TableRow key={index} selected={selectedEventId === event.id}>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{event.description}</TableCell>
                  <TableCell>{event.course?.title}</TableCell>
                  <TableCell>{event.startDate}</TableCell>
                  <TableCell>{event.endDate}</TableCell>
                  <TableCell>{`${event.teacher?.firstName || ''} ${event.teacher?.lastName || ''}`}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setSelectedEventId(event.id)}
                      sx={{ mr: 1 }}
                    >
                      Select
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => {
                        setEventToUnregister(event.id);
                        setOpenDialog(true);
                      }}
                      disabled={!isBeforeStartDate(event.startDate)}
                    >
                      Unregister
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredEvents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No events found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirm Unregistration</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to drop this event?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmUnregister} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StudentEvents;
