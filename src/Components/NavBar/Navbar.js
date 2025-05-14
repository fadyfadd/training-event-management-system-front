
import React from 'react'
import { AppBar, Button, IconButton, Stack, Toolbar, Typography } from '@mui/material'
import FoundationIcon from '@mui/icons-material/Foundation';
import { NavLink } from 'react-router-dom';


  const Navbar = () => {

    // const role = localStorage.getItem('role');

    const linkStyle = ({ isActive }) => ({
      textDecoration: 'none',
      color: 'inherit',
      borderBottom: isActive ? '2px solid white' : 'none'
    });
    
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
          <NavLink to={"/"} style={linkStyle}>
            <Button color='inherit'>Home</Button>
          </NavLink>
          <NavLink to={"/login"} style={linkStyle}>
          <Button color='inherit'>Login</Button>
          </NavLink>
        </Stack>
      </Toolbar>
      
    </AppBar>
  )
}
export default Navbar;