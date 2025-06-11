// components/SearchBar.js
import React from 'react';
import { TextField, Button, Stack } from '@mui/material';

const SearchBar = ({ searchId, setSearchId, onSearch, onReset }) => {
  return (
    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
      <TextField
        label="Search by Event ID"
        variant="outlined"
        type="number"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        size="small"
      />
      <Button variant="contained" onClick={onSearch} disabled={!searchId}>
        Search
      </Button>
      <Button variant="outlined" onClick={onReset}>
        Reset
      </Button>
    </Stack>
  );
};

export default SearchBar;
