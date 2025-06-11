import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import AdminNav from './NavBar/AdminNav';
import axiosInstance from './axiosInstance';
import SearchBar from './SearchBar';
import EventsTable from './EventsTable';
import StudentsDialog from './StudentsDialog';

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
          showPagination={!searchId}
        />
      </Box>

      <StudentsDialog
        open={dialogOpen}
        students={selectedStudents}
        onClose={handleCloseDialog}
      />
    </>
  );
};
