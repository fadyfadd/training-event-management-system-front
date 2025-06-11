import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AdminNav from './NavBar/AdminNav';
import axiosInstance from './axiosInstance';
import { useSelector } from 'react-redux';


const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: null,
    endDate: null,
    maxStudents: 0,
    courseId: '',
    teacherId: ''
  });

  const {token} = useSelector((state) => state.auth);

  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const [coursesRes, teachersRes] = await Promise.all([
          axiosInstance.get('/courses/all'),
          axiosInstance.get('/teachers/all')
        ]);
        
        setCourses(coursesRes.data);
        setTeachers(teachersRes.data);
      } catch (err) {
        setError('Failed to fetch required data');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name, date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // const token = localStorage.getItem('token');
      
      const eventData = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        maxStudents: formData.maxStudents,
        course: { id: formData.courseId },
        teacher: { id: formData.teacherId }
      };

      const response = await axiosInstance.post('http://localhost:8080/events/save', eventData);

      setSuccess('Event created successfully!');
      setFormData({
        title: '',
        description: '',
        startDate: null,
        endDate: null,
        maxStudents: 0,
        courseId: '',
        teacherId: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <>
      <AdminNav />
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Create New Event
          </Typography>
          
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          
          {success && (
            <Typography color="success.main" sx={{ mb: 2 }}>
              {success}
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3} direction="column">
  <Grid item>
    <TextField
      fullWidth
      label="Title"
      name="title"
      value={formData.title}
      onChange={handleChange}
      required
    />
  </Grid>

  <Grid item>
    <TextField
      fullWidth
      label="Description"
      name="description"
      value={formData.description}
      onChange={handleChange}
      multiline
      rows={4}
      required
    />
  </Grid>

  <Grid item>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label="Start Date"
        value={formData.startDate}
        onChange={(date) => handleDateChange('startDate', date)}
        renderInput={(params) => <TextField {...params} fullWidth required />}
      />
    </LocalizationProvider>
  </Grid>

  <Grid item>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label="End Date"
        value={formData.endDate}
        onChange={(date) => handleDateChange('endDate', date)}
        renderInput={(params) => <TextField {...params} fullWidth required />}
        minDate={formData.startDate}
      />
    </LocalizationProvider>
  </Grid>

  <Grid item>
    <TextField
      fullWidth
      label="Maximum Students"
      name="maxStudents"
      type="number"
      value={formData.maxStudents}
      onChange={handleChange}
      inputProps={{ min: 1 }}
      required
    />
  </Grid>

  <Grid item>
    <FormControl fullWidth>
      <InputLabel>Course</InputLabel>
      <Select
        name="courseId"
        value={formData.courseId}
        onChange={handleChange}
        label="Course"
        required
      >
        {courses.map(course => (
          <MenuItem key={course.id} value={course.id}>
            {course.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>

  <Grid item>
    <FormControl fullWidth>
      <InputLabel>Teacher</InputLabel>
      <Select
        name="teacherId"
        value={formData.teacherId}
        onChange={handleChange}
        label="Teacher"
        required
      >
        {teachers.map(teacher => (
          <MenuItem key={teacher.id} value={teacher.id}>
            {teacher.username} 
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>

  <Grid item>
    <Button type="submit" variant="contained" size="large">
      Create Event
    </Button>
  </Grid>
</Grid>

          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default CreateEvent;