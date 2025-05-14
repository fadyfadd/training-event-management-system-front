import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, } from '@mui/material';
import AdminNav from './NavBar/AdminNav';
import TeacherNav from './NavBar/TeacherNav';


const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        // console.log(token);
        const res = await axios.get('http://localhost:8080/students/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudents(res.data);
        console.log('Response:', res.data);

      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <>
      {role === 'ADMIN' ? <AdminNav /> : role === 'TEACHER' ? <TeacherNav /> : null}
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          All Students
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>First Name</strong></TableCell>
                <TableCell><strong>Last Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.firstName}</TableCell>
                  <TableCell>{student.lastName}</TableCell>
                  <TableCell>{student.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default AllStudents;
