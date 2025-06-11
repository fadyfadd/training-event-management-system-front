// components/EventsTable.js
import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, TablePagination
} from '@mui/material';

const EventsTable = ({
  events, totalElements, page, rowsPerPage,
  onPageChange, onRowsPerPageChange, handleViewStudents, showPagination
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>ID</strong></TableCell>
            <TableCell><strong>Title</strong></TableCell>
            <TableCell><strong>Description</strong></TableCell>
            <TableCell><strong>Start Date</strong></TableCell>
            <TableCell><strong>End Date</strong></TableCell>
            <TableCell><strong>Max Students</strong></TableCell>
            <TableCell><strong>Course Name</strong></TableCell>
            <TableCell><strong>Teacher</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.length > 0 ? (
            events.map((event, index) => (
              <TableRow key={index}>
                <TableCell>{event.id || event.eventId || 'N/A'}</TableCell>
                <TableCell>{event.title}</TableCell>
                <TableCell>{event.description}</TableCell>
                <TableCell>{event.startDate}</TableCell>
                <TableCell>{event.endDate}</TableCell>
                <TableCell>{event.maxStudents}</TableCell>
                <TableCell>{event.course?.title || 'N/A'}</TableCell>
                <TableCell>{`${event.teacher?.firstName || ''} ${event.teacher?.lastName || ''}`}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleViewStudents(event.id || event.eventId)}
                  >
                    View Students
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} align="center">No events found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {showPagination && (
        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[3, 6, 9, 50]}
        />
      )}
    </TableContainer>
  );
};

export default EventsTable;
