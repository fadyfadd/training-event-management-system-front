import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Box, TablePagination,
  TextField, Button, Stack, Dialog, DialogTitle, DialogContent,
  List, ListItem, ListItemText
} from '@mui/material';
import AdminNav from './NavBar/AdminNav';
import axiosInstance from './axiosInstance';

export const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchId, setSearchId] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchEvents = async (page, size) => {
    try {
      // http://localhost:8080/events/paginated?page=${page}&size=${size}
      const res = await axiosInstance.get(`/events/paginated?page=${page}&size=${size}`);
      setEvents(res.data.content);
      setTotalElements(res.data.totalElements);
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  };

  const fetchEventById = async () => {
    if (!searchId) return;

    try {
     const res = await axiosInstance.get(`/events/${searchId}`);
     setEvents([res.data]);
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

  const handleViewStudents = async (eventId) => {
    try {
     const res = await axiosInstance.get(`/events/${eventId}/students`);
     setSelectedStudents(res.data);
     setDialogOpen(true);
    } catch (error) {
      console.error("Error fetching students for event: ", error);
      setSelectedStudents([]);
      setDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedStudents([]);
  };

  return (
    <>
      <AdminNav />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          All Events
        </Typography>

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
                <TableCell><strong>Actions</strong></TableCell>
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
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleViewStudents(event.id || event.eventId)}
                      >
                        View Students
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">No events found.</TableCell>
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

      {/* Dialog for viewing students */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Registered Students</DialogTitle>
        <DialogContent>
          {selectedStudents.length > 0 ? (
            <List>
              {selectedStudents.map((student, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={student.username} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No students registered for this event.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
