import React, { useState } from 'react';
import Navbar from './Navbar';
import {
  Container,
  Paper,
  Avatar,
  Typography,
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Alert,
  MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const LoginPage = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8080/persons/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, password, role }),
      });

      if (!res.ok) {
        throw new Error('Invalid credentials');
      }

      const token = await res.text();
      localStorage.setItem('token', token);
      // localStorage.setItem('role', role);
      setMessage('Login successful!');
      setError('');
      console.log('Token stored:', token);
    } catch (err) {
      setError(err.message);
      setMessage('');
    }
  };

  return (
  <>
  <Navbar />
    <Container maxWidth="sm">
      <Paper elevation={24} sx={{ marginTop: 8, padding: 2 }}>
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

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
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

          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
            Log In
          </Button>
        </Box>
      </Paper>
    </Container>
    </>
  );
};

export default LoginPage;
