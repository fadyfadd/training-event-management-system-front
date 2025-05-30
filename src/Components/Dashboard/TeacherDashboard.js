import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Container, Paper } from '@mui/material';
import TeacherNav from '../NavBar/TeacherNav';

const TeacherDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return (
    <>
      <TeacherNav />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Welcome, {localStorage.getItem('role')}!
          </Typography>
          <Typography variant="body1">
            This is your dashboard.
          </Typography>
        </Paper>
      </Container>
    </>
  );
};

export default TeacherDashboard;
