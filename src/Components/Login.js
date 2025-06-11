import React, { useState } from 'react';
import Navbar from './NavBar/Navbar';
import {
  Container,
  Paper,
  Avatar,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../Store/authSlice';

const LoginPage = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('http://localhost:8080/persons/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, password, role }),
      });

      setLoading(false);

      if (!res.ok) {
        throw new Error('Invalid credentials');
      }

      const token = await res.text();
      dispatch(loginSuccess({ token, role }));
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      setMessage('Login successful!');
      setError('');
      setOpenSnackbar(false);

      if (role === 'ADMIN') {
        navigate("/admin/home");
      } else if (role === 'TEACHER') {
        navigate("/teacher/home");
      } else if (role === 'STUDENT') {
        navigate('/student/home');
      }

    } catch (err) {
      setLoading(false);
      setError(err.message);
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ position: 'relative' }}>
        <Paper elevation={24} sx={{ marginTop: 8, padding: 2, position: 'relative' }}>
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255,255,255,0.7)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10,
              }}
            >
              <CircularProgress size="3rem" />
            </Box>
          )}

          <Avatar
            sx={{
              mx: 'auto',
              bgcolor: 'secondary.main',
              textAlign: 'center',
              mb: 1,
            }}
          >
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
            Log In
          </Typography>

          {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}

          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 2 }}>
            <TextField
              label="Username"
              fullWidth
              required
              autoFocus
              sx={{ mb: 2 }}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              sx={{ mb: 2 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="" disabled> Select Role </MenuItem>
                <MenuItem value="ADMIN">ADMIN</MenuItem>
                <MenuItem value="TEACHER">TEACHER</MenuItem>
                <MenuItem value="STUDENT">STUDENT</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 1 }}
              disabled={loading}
            >
              Log In
            </Button>
          </Box>
        </Paper>
      </Container>


      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert severity="error" onClose={handleCloseSnackbar} sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LoginPage;
