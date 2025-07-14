/* eslint-disable react-hooks/exhaustive-deps */
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
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    RadioGroup,
    Radio,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { CloseOutlined } from '@mui/icons-material';
import { fetchCustomer } from '../../redux/actions/customers';
import { fetchVehiclesByApartment } from '../../redux/actions/vehicles';
import { fetchSubscription, fetchSubscriptionByVehicle } from '../../redux/actions/subscription';
import { addWashLog } from '../../redux/actions/washLog';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

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

const AddWashLogs = ({ open, handleClose, data, editModal, startDate, endDate }) => {
    const dispatch = useDispatch();
    const { list: customerList } = useSelector((state) => state.customer);
    const { vehicle_apartmentList: vehicle_apartmentList, } = useSelector((state) => state.vehicle);
    const { list_subscription_vehicle, list } = useSelector((state) => state.subscription);
    const [washType, setWashType] = useState('');
    const [vehcileId, setVehicleId] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [subscriptionId, setSubscriptionId] = useState('');
    const [subs, setSubs] = useState([]);
    const [isAdditional, setIsAdditional] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState();
    const [type, setType] = useState('');
    const [additionalCharge, setAdditionalCharge] = useState('');
    const [description, setDescription] = useState('');
    const [washDate, setWashDate] = useState(new Date());


    useEffect(() => {
        if (data?.apartmentId) {
            dispatch(fetchCustomer(data?.apartmentId))
            dispatch(fetchVehiclesByApartment(data?.apartmentId));
        }

    }, [data?.apartmentId])

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
            setAdditionalCharge('');
        }
    };

    useEffect(() => {
        const sub = subs.find((item) => item?._id === subscriptionId);
        if (sub?.status === 'expired' || !sub || subscriptionId === "") {
            setIsAdditional(true);
        } else {
            setIsAdditional(false);
        }
        setSelectedSubscription(sub);
        setType('');
    }, [subscriptionId]);

    const handleSubmit = () => {
        const postBody = {
            type,
            subscriptionId: subscriptionId || null,
            reduceQuota: subscriptionId ? true : false,
            apartmentId: data?.apartmentId,
            customerId: selectedCustomer,
            vehicleId: vehcileId || washType || null,
            isAdditional,
            additionalCharge: isAdditional ? Number(additionalCharge) : 0,
            description: description,
            createdAt: washDate
        };

        dispatch(addWashLog({ postBody: postBody, startDate, endDate }));
        handleClose();
    };

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
                                typeof option === 'string' ? option : (option.model + ' -' || '-') + '' + option.vehicleNumber + '-' + (option?.customerId?.name || '')
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
                            ><MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
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
                            {typeof selectedSubscription?.planId?.washQuota?.foam === 'number'
                                ? (selectedSubscription?.planId?.washQuota?.foam ?? 0) - (selectedSubscription?.washesUsed?.foam ?? 0)
                                : '--'}
                        </Typography>

                        <Typography variant="body2">
                            Normal:{' '}
                            {typeof selectedSubscription?.planId?.washQuota?.normal === 'number'
                                ? (selectedSubscription?.planId?.washQuota?.normal ?? 0) - (selectedSubscription?.washesUsed?.normal ?? 0)
                                : '--'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} mt={2}>
                        <Typography variant="body2" mt={1}>
                            Status: {selectedSubscription?.status ?? '--'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} mt={2}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isAdditional}
                                    disabled={selectedSubscription?.status || subscriptionId === ""}
                                    onChange={(e) => setIsAdditional(e.target.checked)}
                                />
                            }
                            label="Additional wash"
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} alignItems="center" mt={2}>

                    <Grid item xs={12} sm={6} mt={2}>
                        <Typography fontWeight={500}>Wash Type</Typography>
                        <RadioGroup
                            row
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <FormControlLabel value="foam" disabled={(selectedSubscription ? (selectedSubscription?.planId?.washQuota?.foam) - (selectedSubscription?.washesUsed?.foam) === 0 : false) && !isAdditional} control={<Radio />} label="Foam" />
                            <FormControlLabel value="normal" disabled={(selectedSubscription ? (selectedSubscription?.planId?.washQuota?.normal) - (selectedSubscription?.washesUsed?.normal) === 0 : false) && !isAdditional} control={<Radio />} label="Normal" />
                        </RadioGroup>
                    </Grid>

                    {isAdditional && <Grid item xs={12} sm={6} mt={2}>
                        <Typography fontWeight={500}>Charge</Typography>
                        <TextField
                            size="small"
                            fullWidth
                            value={additionalCharge}
                            onChange={(e) => setAdditionalCharge(e.target.value)}
                        />

                    </Grid>}

                    <Grid item xs={12} sm={6} mt={2}>
                        <Typography fontWeight={500}>Wash Date</Typography>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                value={washDate}
                                onChange={(newValue) => setWashDate(newValue)}
                                slotProps={{ textField: { size: 'small', fullWidth: true } }}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" mt={2}>
                    <Grid item xs={12} sx={{
                        width: '100%'
                    }}>
                        <Typography fontWeight={500}>Description</Typography>
                        <TextField
                            rows={4}
                            fullWidth
                            size="large"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Grid>
                </Grid>


                <Grid item xs={12} sm={6} mt={2}>
                </Grid>
                <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" color="primary" disabled={!selectedCustomer || !type} onClick={handleSubmit}>
                        {editModal ? 'Edit' : 'Add'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddWashLogs;
