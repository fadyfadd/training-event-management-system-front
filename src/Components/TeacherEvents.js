import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Box,
  Button, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText
} from '@mui/material';
import TeacherNav from './NavBar/TeacherNav';
import axiosInstance from './axiosInstance';

const getUsernameFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || payload.username || '';
  } catch (error) {
    console.error('Error decoding token:', error);
    return '';
  }
};

const TeacherEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEventTitle, setSelectedEventTitle] = useState('');

  const token = localStorage.getItem('token');
  const username = getUsernameFromToken(token);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axiosInstance.get(`/events/teacher/${username}`)
        setEvents(res.data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    if (username) {
      fetchEvents();
    }
  }, [username, token]);

  const handleViewStudents = async (eventId, eventTitle) => {
    try {
      const res = await axiosInstance.get(`/events/${eventId}/students`);
      setSelectedStudents(res.data); 
      setSelectedEventTitle(eventTitle);
      setOpen(true);
    } catch (error) {
      console.error('Failed to fetch students for event:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStudents([]);
  };

  return (
    <>
      <TeacherNav />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Events
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Course Name</strong></TableCell>
                <TableCell><strong>Start Date</strong></TableCell>
                <TableCell><strong>End Date</strong></TableCell>
                <TableCell><strong>Max Students</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event, index) => (
                <TableRow key={index}>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{event.description}</TableCell>
                  <TableCell>{event.course?.title}</TableCell>
                  <TableCell>{event.startDate}</TableCell>
                  <TableCell>{event.endDate}</TableCell>
                  <TableCell>{event.maxStudents}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleViewStudents(event.id, event.title)}
                    >
                      View Students
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Student List Dialog */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Students Registered for "{selectedEventTitle}"</DialogTitle>
          <DialogContent dividers>
            {selectedStudents.length > 0 ? (
              <List>
                {selectedStudents.map((student, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={student.username || student} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No students registered for this event.</Typography>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
};

export default TeacherEvents;
