import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const ExistingInterviewModal = ({ open, onClose, existingDate }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <h2 id="modal-title">Existing Interview Date</h2>
        <p id="modal-description">
          You already have an interview scheduled on {existingDate?.format('MMMM D, YYYY h:mm A')}.
        </p>
        <Button onClick={onClose}>Close</Button>
      </Box>
    </Modal>
  );
};

export default ExistingInterviewModal;
