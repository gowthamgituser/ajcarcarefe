import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    TextField,
    Button,
    Typography,
    Grid,
    IconButton,
    Autocomplete,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { CloseOutlined } from '@mui/icons-material';
import { addCustomer, fetchCustomer, updateCustomer } from '../../redux/actions/customers';
import { fetchVehiclesByApartment } from '../../redux/actions/vehicles';
import { fetchSubscription, fetchSubscriptionByVehicle } from '../../redux/actions/subscription';

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

const AddWashLogs = ({ open, handleClose, data, editModal }) => {
    const dispatch = useDispatch();
    const { list: customerList, loading } = useSelector((state) => state.customer);
    const { vehicle_apartmentList: vehicle_apartmentList, } = useSelector((state) => state.vehicle);
    const { list_subscription_vehicle, list } = useSelector((state) => state.subscription);
    const [errors, setErrors] = useState({});
    const [washType, setWashType] = useState('');
    const [vehcileId, setVehicleId] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [subscriptionId, setSubscriptionId] = useState('');
    const [subs, setSubs] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        blockNumber: '',
        flatNumber: ''
    });

    useEffect(() => {
        if (data?.apartmentId) {
            dispatch(fetchCustomer(data?.apartmentId))
            dispatch(fetchVehiclesByApartment(data?.apartmentId));
        }

    }, [data?.apartmentId])

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

    useEffect(() => {
        if (vehcileId) {
            dispatch(fetchSubscriptionByVehicle(vehcileId));
        }
    }, [vehcileId]);

    useEffect(() => {
        if (selectedCustomer && !vehcileId) {
            dispatch(fetchSubscription(selectedCustomer));
        }
    }, [selectedCustomer, vehcileId]);

    useEffect(() => {

        if (list_subscription_vehicle.length && vehcileId) {
            setSubs(list_subscription_vehicle);
        }
        if (list?.length && (selectedCustomer && !vehcileId)) {
            setSubs(list);
        }

    }, [list_subscription_vehicle, list])

    const handleCustomerChange = (event) => {
        setSelectedCustomer(event.target.value);
        setSubs([]);
        setSubscriptionId('');
    };

    const handleVehicleChange = (event, newValue) => {
        if (typeof newValue === 'object' && newValue !== null) {
            setWashType(newValue.vehicleNumber);
            setVehicleId(newValue._id);
            if (newValue.customerId) {
                setSelectedCustomer(newValue.customerId?._id);
            }
        } else {
            setSubs([]);
            setSubscriptionId('');
            setVehicleId('');
            setWashType(newValue);
            setSelectedCustomer('');
        }
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

    const sub = subs.find((item) => item?._id === subscriptionId);

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h5" style={{ fontFamily: 'cursive' }} mb={3}>{editModal ? 'Edit Wash Log' : 'Add Wash Log'}</Typography>
                    </Box>
                    <Box>
                        <IconButton onClick={() => {
                            handleClose();
                        }}>
                            <CloseOutlined />
                        </IconButton>
                    </Box>
                </Box>
                <Grid container spacing={2} display={'flex'} alignItems={'center'}>
                    <Grid sm={6} sx={{
                        width: '50%'
                    }}>
                        <Typography fontWeight={500} >Vehicle Number</Typography>
                        <Autocomplete
                            sx={{
                                width: '100%'
                            }}
                            freeSolo
                            options={vehicle_apartmentList}
                            getOptionLabel={(option) =>
                                typeof option === 'string' ? option : option.vehicleNumber
                            }
                            value={washType}
                            onChange={handleVehicleChange}
                            onInputChange={(event, newInputValue) => {
                                if (typeof newInputValue === 'string') {
                                    setWashType(newInputValue);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField {...params} placeholder="Enter or select vehicle number" />
                            )}
                        />
                    </Grid>

                    <Grid sm={6}>
                        <Typography fontWeight={500}>Customer Name</Typography>
                        <FormControl sx={{ minWidth: 200 }} size="small">
                            <Select
                                labelId="customer-select-label"
                                id="customer-select"
                                value={selectedCustomer}
                                label="Customer"
                                onChange={handleCustomerChange}
                                disabled={!washType || vehcileId}
                            >
                                {customerList.map((customer) => (
                                    <MenuItem key={customer._id} value={customer._id}>
                                        {customer.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>


                </Grid>

                <Grid container spacing={2} alignItems="center" mt={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography fontWeight={500}>Subscribed Plans</Typography>
                        <FormControl fullWidth size="small">
                            <Select
                                labelId="customer-select-label"
                                id="customer-select"
                                value={subscriptionId || ''}
                                onChange={(event) => {
                                    setSubscriptionId(event.target.value);
                                }}
                            >
                                {subs.map((subscription) => (
                                    <MenuItem key={subscription._id} value={subscription._id}>
                                        {subscription.planId?.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} mt={2}>
                        <Typography variant="body2">
                            Foam:{' '}
                            {typeof sub?.planId?.washQuota?.foam === 'number'
                                ? (sub?.planId?.washQuota?.foam ?? 0) - (sub?.washesUsed?.foam ?? 0)
                                : '--'}
                        </Typography>

                        <Typography variant="body2">
                            Normal:{' '}
                            {typeof sub?.planId?.washQuota?.normal === 'number'
                                ? (sub?.planId?.washQuota?.normal ?? 0) - (sub?.washesUsed?.normal ?? 0)
                                : '--'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} mt={2}>
                        <Typography variant="body2" mt={1}>
                            Status: {sub?.status ?? '--'}
                        </Typography>
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

export default AddWashLogs;
