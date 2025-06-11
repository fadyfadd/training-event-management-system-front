import React from 'react';
import {
  Dialog, DialogTitle, DialogContent,
  Typography, List, ListItem, ListItemText
} from '@mui/material';

const StudentsDialog = ({ open, students, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Registered Students</DialogTitle>
      <DialogContent>
        {students.length > 0 ? (
          <List>
            {students.map((student, idx) => (
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
  );
};

export default StudentsDialog;
