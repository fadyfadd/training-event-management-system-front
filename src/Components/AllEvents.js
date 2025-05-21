import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Box, TablePagination,
  TextField, Button, Stack,
} from '@mui/material';
import AdminNav from './NavBar/AdminNav';

export const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchId, setSearchId] = useState('');

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

  const fetchEventById = async () => {
    if (!searchId) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:8080/events/${searchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvents([res.data]); // Wrap single event in array for table rendering
      setTotalElements(1);
      setPage(0);
    } catch (error) {
      console.error("Event not found: ", error);
      setEvents([]);
      setTotalElements(0);
    }
  };

  useEffect(() => {
    if (!searchId) {
      fetchEvents(page, rowsPerPage);
    }
  }, [page, rowsPerPage, searchId]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = () => {
    setPage(0);
    fetchEventById();
  };

  const handleReset = () => {
    setSearchId('');
    setPage(0);
    fetchEvents(0, rowsPerPage);
  };

  return (
    <>
      <AdminNav />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          All Events
        </Typography>

        {/* Search bar and buttons */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="Search by Event ID"
            variant="outlined"
            type="number"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            size="small"
          />
          <Button variant="contained" onClick={handleSearch} disabled={!searchId}>
            Search
          </Button>
          <Button variant="outlined" onClick={handleReset}>
            Reset
          </Button>
        </Stack>

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
              {events.length > 0 ? (
                events.map((event, index) => (
                  <TableRow key={index}>
                    <TableCell>{event.id || event.eventId || 'N/A'}</TableCell>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>{event.description}</TableCell>
                    <TableCell>{event.startDate}</TableCell>
                    <TableCell>{event.endDate}</TableCell>
                    <TableCell>{event.maxStudents}</TableCell>
                    <TableCell>{event.course?.title || 'N/A'}</TableCell>
                    <TableCell>{`${event.teacher?.firstName || ''} ${event.teacher?.lastName || ''}`}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">No events found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {!searchId && (
            <TablePagination
              component="div"
              count={totalElements}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[3, 6, 9, 50]}
            />
          )}
        </TableContainer>
      </Box>
    </>
  );
};
