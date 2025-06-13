import React, { useEffect, useState } from 'react';
import { Typography, Box, Button } from '@mui/material';
import AdminNav from './NavBar/AdminNav';
import axiosInstance from './axiosInstance';
// import SearchBar from './SearchBar';
import CoursesTable from './CoursesTable';
import CourseFormDialog from './CourseFormDialog';
import { Snackbar, Alert } from '@mui/material';

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const fetchCourses = async () => {
        try {
            const res = await axiosInstance.get('/courses/all');
            setCourses(res.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchCourseById = async () => {
        if (!searchId) return;
        try {
            const res = await axiosInstance.get(`/courses/all`);
            const result = res.data.filter(course => course.id.toString() === searchId);
            setCourses(result);
        } catch (error) {
            console.error('Course not found:', error);
            setCourses([]);
        }
    };

    useEffect(() => {
        if (!searchId) fetchCourses();
    }, [searchId]);

    const handleSearch = () => {
        fetchCourseById();
    };

    const handleReset = () => {
        setSearchId('');
        fetchCourses();
    };

    const handleOpenDialog = () => setDialogOpen(true);
    const handleCloseDialog = () => {
        setDialogOpen(false);
        fetchCourses(); // refresh after adding
    };

    const handleDeleteCourse = async (id) => {
        try {
            await axiosInstance.delete(`/courses/delete/${id}`);
            setSnackbarMessage('Course deleted successfully');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            fetchCourses(); // Refresh the course list
        } catch (error) {
            console.error('Error deleting course:', error);
            setSnackbarMessage('Course cannot be deleted because it is linked to an event.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };




    return (
        <>
            <AdminNav />
            <Box sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Manage Courses
                </Typography>

                {/* <SearchBar
          searchId={searchId}
          setSearchId={setSearchId}
          onSearch={handleSearch}
          onReset={handleReset}
        /> */}

                <Button variant="contained" color="primary" onClick={handleOpenDialog} sx={{ mb: 2 }}>
                    Add New Course
                </Button>

                <CoursesTable
                    courses={courses}
                    handleConfirmDelete={handleDeleteCourse}
                />

            </Box>

            <CourseFormDialog open={dialogOpen} onClose={handleCloseDialog} />
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </>
    );
};

export default ManageCourses;
