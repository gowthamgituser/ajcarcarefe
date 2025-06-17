import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Divider,
  IconButton,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addplans, updateplans } from '../../redux/actions/plans';
import { CloseOutlined } from '@mui/icons-material';

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

const AddPlanModal = ({ open, handleClose, data, editModal }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    vehicleType: 1,
    washQuota: {
      foam: '',
      normal: '',
    },
  });

  useEffect(() => {
    if (editModal && data) {
      setFormData({
        name: data.name || '',
        price: data.price || '',
        description: data.description || '',
        vehicleType: data.vehicleType || 1,
        washQuota: {
          foam: data.washQuota?.foam || '',
          normal: data.washQuota?.normal || '',
        },
      });
    }
  }, [editModal, data]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'foam' || name === 'normal') {
      setFormData((prev) => ({
        ...prev,
        washQuota: {
          ...prev.washQuota,
          [name]: value,
        },
      }));
    } else if (name === 'vehicleType') {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Plan name is required';
    if (!formData.price || isNaN(Number(formData.price))) newErrors.price = 'Valid price is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const postBody = {
      ...formData,
      price: Number(formData.price),
      washQuota: {
        foam: Number(formData.washQuota.foam),
        normal: Number(formData.washQuota.normal),
      },
      apartmentId: data.apartmentId,
    };
    if(editModal) {
      dispatch(updateplans({ payload: postBody, id: data?._id }));
    } else {
      dispatch(addplans(postBody));
    }
    handleClose();
    setFormData({
      name: '',
      price: '',
      description: '',
      vehicleType: 1,
      washQuota: {
        foam: '',
        normal: '',
      },
    });
    setErrors({});
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box style={{ display: 'flex', justifyContent: 'space-between'}}>
            <Box>
            <Typography variant="h5" style={{ fontFamily:'cursive'}} mb={3}>{editModal ? 'Edit Plan' : 'Add Plan' }</Typography>
            </Box>
            <Box>
                <IconButton onClick={() => {
                    handleClose();
                }}>
                    <CloseOutlined/>
                </IconButton>
            </Box>
        </Box>        
        <Grid container spacing={2}>
          <Grid  xs={12} sm={6}>
            <Typography fontWeight={500} >Plan Name</Typography>
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

          <Grid  xs={12} sm={6}>
            <Typography fontWeight={500}>Price</Typography>
            <TextField
              fullWidth
              margin="dense"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              error={!!errors.price}
              helperText={errors.price}
            />
          </Grid>

          <Grid  xs={12}>
            <Typography fontWeight={500}>Description</Typography>
            <TextField
              fullWidth
              margin="dense"
              name="description"
              multiline
              rows={2}
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>

          <Grid  xs={12}>
          <Typography fontWeight={500}>Vehicle Type</Typography>
<Box display="flex" gap={2} mt={1}>
  <label>
    <input
      type="radio"
      name="vehicleType"
      value={1}
      checked={formData.vehicleType === 1}
      onChange={handleChange}
    />
    &nbsp;Four Wheeler
  </label>
  <label>
    <input
      type="radio"
      name="vehicleType"
      value={2}
      checked={formData.vehicleType === 2}
      onChange={handleChange}
    />
    &nbsp;Two Wheeler
  </label>
</Box>

          </Grid>

          <Grid  xs={12} sm={6}>
            <Typography fontWeight={500}>Foam Wash Quota</Typography>
            <TextField
              fullWidth
              margin="dense"
              name="foam"
              type="number"
              value={formData.washQuota.foam}
              onChange={handleChange}
            />
          </Grid>

          <Grid  xs={12} sm={6}>
            <Typography fontWeight={500}>Normal Wash Quota</Typography>
            <TextField
              fullWidth
              margin="dense"
              name="normal"
              type="number"
              value={formData.washQuota.normal}
              onChange={handleChange}
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

export default AddPlanModal;
