import React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';

const AlertModal = ({ open, handleClose, handleConfirmDelete }) => {

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Typography>Are you sure you want to delete ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  };
 export default AlertModal;
