import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{
      display: 'flex',
      gap: '1rem',
      padding: '1rem',
      background: '#f0f0f0',
      marginBottom: '2rem'
    }}>
      <NavLink
        to="/"
        style={({ isActive }) => ({
          color: isActive ? 'blue' : 'black',
          textDecoration: 'none',
          fontWeight: isActive ? 'bold' : 'normal'
        })}
      >
        Home
      </NavLink>
      <NavLink
        to="/login"
        style={({ isActive }) => ({
          color: isActive ? 'blue' : 'black',
          textDecoration: 'none',
          fontWeight: isActive ? 'bold' : 'normal'
        })}
      >
        Login
      </NavLink>
    </nav>
  );
};

export default Navbar;