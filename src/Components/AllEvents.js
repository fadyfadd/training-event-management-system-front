import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import AdminNav from './NavBar/AdminNav';
import axiosInstance from './axiosInstance';
import SearchBar from './SearchBar';
import EventsTable from './EventsTable';
import StudentsDialog from './StudentsDialog';
import {
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

export const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchId, setSearchId] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');


  const handleDeleteClick = (id) => {
    setEventIdToDelete(id);
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/events/delete/${eventIdToDelete}`);
      setSnackbarMessage('Event deleted successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      fetchEvents(page, rowsPerPage);
    } catch (error) {
      console.error("Delete failed:", error);
      setSnackbarMessage('Failed to delete event');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setDeleteDialogOpen(false);
      setEventIdToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setEventIdToDelete(null);
  };


  const fetchEvents = async (page, size) => {
    try {
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

  const handleChangePage = (event, newPage) => setPage(newPage);
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

        <SearchBar
          searchId={searchId}
          setSearchId={setSearchId}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        <EventsTable
          events={events}
          totalElements={totalElements}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          handleViewStudents={handleViewStudents}
          onDeleteClick={handleDeleteClick}
          showPagination={!searchId}
        />

      </Box>

      <StudentsDialog
        open={dialogOpen}
        students={selectedStudents}
        onClose={handleCloseDialog}
      />
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this event? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

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
