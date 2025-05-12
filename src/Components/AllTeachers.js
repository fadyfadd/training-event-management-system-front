import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, } from '@mui/material';
import AdminNav from './AdminNav';


export const AllTeachers = () => {
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        const fetchTeachers = async () =>{
            try{
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:8080/teachers/all', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                setTeachers(res.data);
            }catch(error){
                console.error("error fetching teachers: ", error);
            }
        };
        fetchTeachers();
    }, [])
  return (
   <>
    <AdminNav/>
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Teachers
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
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>{teacher.id}</TableCell>
                <TableCell>{teacher.firstName}</TableCell>
                <TableCell>{teacher.lastName}</TableCell>
                <TableCell>{teacher.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
   </>
  )
}
