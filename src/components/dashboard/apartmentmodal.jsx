import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
} from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { addApartment, updateApartment } from '../../redux/actions/apartment';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 600,
  maxHeight: '100vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: { xs: 1, sm: 2 },
};

const AddApartmentModal = ({ open, handleClose, data, editModal }) => {

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
  });

  useEffect(() => {
    if (editModal && data) {
      setFormData({
        name: data.name || '',
        address: data.address || '',
      });
    }
  }, [editModal, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (editModal) {
      const postBody = formData;
      dispatch(updateApartment({ payload: postBody, id: data?._id }));
    } else {
      const postBody = formData;
      dispatch(addApartment(postBody));
    }

    handleClose();
    setFormData({
      name: '',
      address: '',
    });
    setErrors({});
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5" style={{ fontFamily: 'cursive' }} mb={3}>
            {editModal ? 'Edit Apartment' : 'Add Apartment'}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseOutlined />
          </IconButton>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography fontWeight={500}>Name</Typography>
            <TextField
              fullWidth
              margin="dense"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography fontWeight={500}>Address</Typography>
            <TextField
              fullWidth
              margin="dense"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={!!errors.address}
              helperText={errors.address}
            />
          </Grid>
        </Grid>

        <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {editModal ? 'Edit' : 'Add'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddApartmentModal;
