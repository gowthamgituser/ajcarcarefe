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
import { useDispatch } from 'react-redux';
import { CloseOutlined } from '@mui/icons-material';
import { addCustomer, updateCustomer } from '../../redux/actions/customers';

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

const CustomerModal = ({ open, handleClose, data, editModal }) => {
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        blockNumber: '',
        flatNumber: ''
    });

    useEffect(() => {
        if (editModal && data) {
            setFormData({
                name: data.name || '',
                phone: data.phone || '',
                blockNumber: data.blockNumber || '',
                flatNumber: data.flatNumber || ''
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

        if (!formData.name.trim()) {
            newErrors.name = 'Customer name is required';
        }

        const phoneRegex = /^\+?[1-9]\d{7,14}$/; // Allows optional '+' and 8-15 digits total
        if (!formData.phone || !phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Valid phone number is required';
        }

        if (!formData.blockNumber.trim()) {
            newErrors.blockNumber = 'Block Number is required';
        }

        if (!formData.flatNumber.trim()) {
            newErrors.flatNumber = 'Flat Number is required';
        }

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
            apartmentId: data.apartmentId,
        };
        if (editModal) {
            dispatch(updateCustomer({ payload: postBody, id: data?._id }));
        } else {
            dispatch(addCustomer(postBody));
        }
        handleClose();
        setFormData({
            name: '',
            phone: '',
            blockNumber: '',
            flatNumber: '',
        });
        setErrors({});
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h5" style={{ fontFamily: 'cursive' }} mb={3}>{editModal ? 'Edit Customer' : 'Add Customer'}</Typography>
                    </Box>
                    <Box>
                        <IconButton onClick={() => {
                            handleClose();
                        }}>
                            <CloseOutlined />
                        </IconButton>
                    </Box>
                </Box>
                <Grid container spacing={2}>
                    <Grid sm={6}>
                        <Typography fontWeight={500} >Name</Typography>
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

                    <Grid sm={6}>
                        <Typography fontWeight={500}>Phone</Typography>
                        <TextField
                            fullWidth
                            margin="dense"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            error={!!errors.phone}
                            helperText={errors.phone}
                        />
                    </Grid>

                    <Grid sm={6}>
                        <Typography fontWeight={500} >Block No.</Typography>
                        <TextField
                            fullWidth
                            margin="dense"
                            name="blockNumber"
                            value={formData.blockNumber}
                            onChange={handleChange}
                            error={!!errors.blockNumber}
                            helperText={errors.blockNumber}
                        />
                    </Grid>

                    <Grid sm={6}>
                        <Typography fontWeight={500}>Flat No.</Typography>
                        <TextField
                            fullWidth
                            margin="dense"
                            name="flatNumber"
                            value={formData.flatNumber}
                            onChange={handleChange}
                            error={!!errors.flatNumber}
                            helperText={errors.flatNumber}
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

export default CustomerModal;
