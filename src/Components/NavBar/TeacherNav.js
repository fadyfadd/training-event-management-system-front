import React from 'react'
import { AppBar, Button, IconButton, Stack, Toolbar, Typography } from '@mui/material'
import FoundationIcon from '@mui/icons-material/Foundation';
import { NavLink, useNavigate } from 'react-router-dom';


export const TeacherNav = () => {
    const linkStyle = ({ isActive }) => ({
        textDecoration: 'none',
        color: 'inherit',
        borderBottom: isActive ? '2px solid white' : 'none'
      });

      const navigate = useNavigate();

      const handleLogout = () =>{
        localStorage.removeItem('token');
        localStorage.removeItem('role');

        navigate('/', { replace: true });
      };
  return (
    <AppBar position='static'>
      <Toolbar>
        <IconButton size='large' edge='start' color='inherit' aria-label='logo'>
          <FoundationIcon />
        </IconButton>
        <Typography variant='h6' component='div' sx={{flexGrow : 1}}>
          Training System
        </Typography>
        <Stack direction={'row'} spacing={2}>

          <NavLink to="/teacher/home" style={linkStyle}>
            <Button color='inherit'>Home</Button>
          </NavLink>

          <NavLink to="/teacher/getAllStudents" style={linkStyle} >
            <Button color='inherit'>All Students</Button>
          </NavLink>

          <NavLink to="/teacher/myEvents" style={linkStyle} >
            <Button color='inherit'>My Events</Button>
          </NavLink>

          <Button color='inherit' onClick={handleLogout}>Log Out</Button>

        </Stack>
      </Toolbar>
      
    </AppBar>
  )
}
export default TeacherNav;
