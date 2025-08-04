import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    IconButton,
    Stack,
    Button,
    MenuItem,
    Select,
    FormControl,
    OutlinedInput,
    Checkbox,
    ListItemText,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';
import {
    CloseOutlined,
    AddCircleOutline,
    SaveOutlined,
    DeleteOutline,
    TwoWheelerRounded,
    LocalCarWash,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchplans } from '../../redux/actions/plans';
import { useParams } from 'react-router-dom';
import { addSubscription, deleteSubscription, updateSubscription } from '../../redux/actions/subscription';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    maxWidth: 1100,
    height: '60vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 3,
};

const SubscriptionModal = ({ open, handleClose, customerDetails }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { list: vehicleList } = useSelector((state) => state.vehicle);
    const { list: planList } = useSelector((state) => state.plan);
    const { list: subscriptionList } = useSelector((state) => state.subscription);
    const [subscriptions, setSubscriptions] = useState([]);

    useEffect(() => {
        if (id) {
            dispatch(fetchplans(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (subscriptionList.length) {
            const getSubscriptionList = subscriptionList.map((item) => {
                return {
                    planId: item.planId?._id,
                    vehicleIds: item.vehicleIds.map((item) => item?._id) || [],
                    _id: item?._id,
                    washesUsed: item.washesUsed
                }
            })
            setSubscriptions(getSubscriptionList);
        }
    }, [subscriptionList]);

    const handleAddSubscription = () => {
        setSubscriptions(prev => [
            ...prev,
            {
                id: Date.now(),
                planId: '',
                vehicleIds: [],
                isNewRow: true
            },
        ]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...subscriptions];
        updated[index][field] = value;
        setSubscriptions(updated);
    };

    const handleDelete = (index, sub) => {
        setSubscriptions(prev => prev.filter((_, i) => i !== index));
        if (!sub?.isNewRow)
            dispatch(deleteSubscription({ id: sub?._id, customerId: customerDetails?._id }));
    };

    const handleSave = (sub) => {
        const payload = {
            customerId: customerDetails?._id,
            apartmentId: customerDetails?.apartmentId,
            planId: sub.planId,
            vehicleIds: sub.vehicleIds
        }
        if (sub.isNewRow) {
            dispatch(addSubscription(payload))
        } else {
            dispatch(updateSubscription({ payload, id: sub?._id }))
        }

    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Stack direction="row" justifyContent="space-between" mb={2}>
                    <Typography variant="h6">Manage Subscription</Typography>
                    <IconButton onClick={handleClose}>
                        <CloseOutlined />
                    </IconButton>
                </Stack>

                <Box mb={2}>
                    <Button disabled={subscriptions.find((item)=> item.isNewRow)} startIcon={<AddCircleOutline />} onClick={handleAddSubscription}>
                        Add Subscription
                    </Button>
                </Box>

                <TableContainer component={Paper} sx={{ mb: 2 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Plan</strong></TableCell>
                                <TableCell><strong>Price</strong></TableCell>
                                <TableCell><strong>Plan for</strong></TableCell>
                                <TableCell><strong>Quota</strong></TableCell>
                                <TableCell><strong>Vehicles</strong></TableCell>
                                <TableCell align="center"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {subscriptions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No plan found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                subscriptions.map((sub, index) => {
                                    const selectedPlan = planList.find(p => p._id === sub.planId);
                                    return (
                                        <TableRow key={sub.id}>
                                            {/* Plan Select */}
                                            <TableCell>
                                                <FormControl sx={{ width: '250px' }} size="small">
                                                    <Select
                                                        disabled={(sub?.washesUsed?.foam !== 0 || sub?.washesUsed?.normal !== 0) && (!sub?.isNewRow)}
                                                        value={sub.planId}
                                                        onChange={(e) => handleChange(index, 'planId', e.target.value)}
                                                    >
                                                        {planList.map(plan => (
                                                            <MenuItem key={plan._id} value={plan._id}>
                                                                {plan.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </TableCell>

                                            {/* Price */}
                                            <TableCell>₹{selectedPlan?.price || '--'}</TableCell>

                                            {/* Vehicle Type */}
                                            <TableCell>
                                                {selectedPlan?.vehicleType === 1 ? (
                                                    <IconButton><LocalCarWash /></IconButton>
                                                ) : selectedPlan?.vehicleType === 2 ? (
                                                    <IconButton><TwoWheelerRounded /></IconButton>
                                                ) : '--'}
                                            </TableCell>

                                            {/* Quota */}
                                            <TableCell>
                                                <Typography variant="body2">Foam: {selectedPlan?.washQuota?.foam || '--'}</Typography>
                                                <Typography variant="body2">Normal: {selectedPlan?.washQuota?.normal || '--'}</Typography>
                                            </TableCell>

                                            {/* Vehicle Selector */}
                                            <TableCell>
                                                <FormControl sx={{ width: '400px' }} size="small">
                                                    <Select
                                                        multiple
                                                        value={sub.vehicleIds}
                                                        onChange={(e) => handleChange(index, 'vehicleIds', e.target.value)}
                                                        input={<OutlinedInput />}
                                                        renderValue={(selected) =>
                                                            selected
                                                                .map(id => {
                                                                    const vehicle = vehicleList.find(v => v._id === id);
                                                                    return vehicle ? `${vehicle.vehicleNumber} - ${vehicle.model}` : '';
                                                                })
                                                                .join(', ')
                                                        }
                                                    >
                                                        {vehicleList.map(vehicle => (
                                                            <MenuItem key={vehicle._id} value={vehicle._id}>
                                                                <Checkbox checked={sub.vehicleIds.includes(vehicle._id)} />
                                                                <ListItemText
                                                                    primary={`${vehicle.vehicleNumber} - ${vehicle.model}`}
                                                                />
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell align="center">
                                                <IconButton color="primary" onClick={() => handleSave(sub)}>
                                                    <SaveOutlined />
                                                </IconButton>
                                                <IconButton disabled={(sub?.washesUsed?.foam !== 0 || sub?.washesUsed?.normal !== 0) && (!sub?.isNewRow)} color="error" onClick={() => handleDelete(index, sub)}>
                                                    <DeleteOutline />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>

                    </Table>
                </TableContainer>

            </Box>
        </Modal>
    );
};

export default SubscriptionModal;
