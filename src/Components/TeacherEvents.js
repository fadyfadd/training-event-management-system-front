import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Box,
} from '@mui/material';
import TeacherNav from './NavBar/TeacherNav';

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
//   const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const username = getUsernameFromToken(token);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/events/teacher/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(res.data);
        console.log('Events fetched:', res.data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    if (username) {
      fetchEvents();
    }
  }, [username, token]);

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
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event, index) => (
                <TableRow key={index}>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{event.description}</TableCell>
                  <TableCell>{event.course.title}</TableCell>
                  <TableCell>{event.startDate}</TableCell>
                  <TableCell>{event.endDate}</TableCell>
                  <TableCell>{event.maxStudents}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default TeacherEvents;
