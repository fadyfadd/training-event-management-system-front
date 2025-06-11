import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import AdminNav from './NavBar/AdminNav';
import TeacherNav from './NavBar/TeacherNav';
import axiosInstance from './axiosInstance';
import { useSelector } from 'react-redux';

const RegisterStudentToEvent = () => {
  const [studentId, setStudentId] = useState('');
  const [eventId, setEventId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  // const role = localStorage.getItem('role');
  // const token = localStorage.getItem('token');
  const { token, role } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axiosInstance.post(
        `/students/${studentId}/events/${eventId}/register`);
      setMessage(res.data);
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <>
      {role === 'ADMIN' ? <AdminNav /> : role === 'TEACHER' ? <TeacherNav /> : null}

      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500 }}>
          <Typography variant="h5" gutterBottom>
            Register Student to Event
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Event ID"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ mt: 2 }}
            >
              Register
            </Button>
          </form>

          {message && <Alert sx={{ mt: 2 }} severity="success">{message}</Alert>}
          {error && <Alert sx={{ mt: 2 }} severity="error">{error}</Alert>}
        </Paper>
      </Box>
    </>
  );
};

export default RegisterStudentToEvent;
