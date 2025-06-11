import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Box, TablePagination, TextField, Button, Stack,
} from '@mui/material';
import AdminNav from './NavBar/AdminNav';
import TeacherNav from './NavBar/TeacherNav';
import axiosInstance from './axiosInstance';
import { useSelector } from 'react-redux';

const AllTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  // const role = localStorage.getItem('role');
  const {token, role} = useSelector((state) => state.auth);

  const fetchTeachers = async (page, size, username = '') => {
    try {
      // const token = localStorage.getItem('token');
      const url = username
        ? `/teachers/search?username=${username}&page=${page}&size=${size}`
        : `/teachers/search?page=${page}&size=${size}`;

      const res = await axiosInstance.get(url);

      setTeachers(res.data.content);
      setTotalElements(res.data.totalElements);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
    }
  };

  useEffect(() => {
    fetchTeachers(page, rowsPerPage, searchTerm);
  }, [page, rowsPerPage, searchTerm, token]);

  const handleSearch = () => {
    setPage(0);
    setSearchTerm(searchQuery.trim());
  };

  const handleReset = () => {
    setSearchQuery('');
    setSearchTerm('');
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      {role === 'ADMIN' ? <AdminNav /> : role === 'TEACHER' ? <TeacherNav /> : null}
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          All Teachers
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="Search by Username"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
          />
          <Button 
            variant="contained" 
            onClick={handleSearch}
            disabled={!searchQuery.trim()}
          >
            Search
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleReset}
          >
            Reset
          </Button>
        </Stack>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Username</strong></TableCell>
                <TableCell><strong>First Name</strong></TableCell>
                <TableCell><strong>Last Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>{teacher.id}</TableCell>
                    <TableCell>{teacher.username}</TableCell>
                    <TableCell>{teacher.firstName}</TableCell>
                    <TableCell>{teacher.lastName}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No teachers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={totalElements}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </TableContainer>
      </Box>
    </>
  );
};

export default AllTeachers;
