import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Typography, Box, TablePagination,
} from '@mui/material';
import AdminNav from './NavBar/AdminNav';

export const AllEvents = () => {
    const [events, setEvents] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [page, setPage] = useState(0); 
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const fetchEvents = async (page, size) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:8080/events/paginated?page=${page}&size=${size}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEvents(res.data.content);
            setTotalElements(res.data.totalElements);
        } catch (error) {
            console.error("Error fetching events: ", error);
        }
    };

    useEffect(() => {
        fetchEvents(page, rowsPerPage);
    }, [page, rowsPerPage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
            <AdminNav />
            <Box sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    All Events
                </Typography>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell><strong>Title</strong></TableCell>
                                <TableCell><strong>Description</strong></TableCell>
                                <TableCell><strong>Start Date</strong></TableCell>
                                <TableCell><strong>End Date</strong></TableCell>
                                <TableCell><strong>Max Students</strong></TableCell>
                                <TableCell><strong>Course Name</strong></TableCell>
                                <TableCell><strong>Teacher</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {events.map((event, index) => (
                                <TableRow key={index}>
                                    <TableCell>{event.id}</TableCell>
                                    <TableCell>{event.title}</TableCell>
                                    <TableCell>{event.description}</TableCell>
                                    <TableCell>{event.startDate}</TableCell>
                                    <TableCell>{event.endDate}</TableCell>
                                    <TableCell>{event.maxStudents}</TableCell>
                                    <TableCell>{event.course?.title || 'N/A'}</TableCell>
                                    <TableCell>{`${event.teacher?.firstName || ''} ${event.teacher?.lastName || ''}`}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <TablePagination
                        component="div"
                        count={totalElements}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[3, 6, 9, 50]}
                    />
                </TableContainer>
            </Box>
        </>
    );
};
