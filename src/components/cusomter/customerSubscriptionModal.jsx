import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    IconButton,
    Stack,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
    CloseOutlined,
    AddCircleOutline,
    SaveOutlined,
    DeleteOutline,
    ManageAccounts,
    LocalCarWash,
    TwoWheelerRounded,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { addVehicles, deleteVehicles, fetchVehicles, updateVehicles } from '../../redux/actions/vehicles';
import { columns } from './table_config';
import SubscriptionModal from './subscriptionModal';
import { fetchSubscription } from '../../redux/actions/subscription';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    maxWidth: 900,
    height: '80vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 3,
};

const CustomerSubscriptionModal = ({ open, handleClose, data }) => {
    const dispatch = useDispatch();
    const { list } = useSelector((state) => state.vehicle);
    const [rows, setRows] = useState([]);
    const [showCustomerSubModal, setShowCustomerSubModal] = useState(false);
    const { list: subscriptionList } = useSelector((state) => state.subscription);
    const [subs, setSubs] = useState([]);

    useEffect(() => {
        if (data?._id) {
            dispatch(fetchVehicles(data._id));
            dispatch(fetchSubscription(data?._id));
        }
    }, [data?._id]);

    useEffect(() => {
        if (list?.length) {
            setRows(list.map((item, idx) => ({ id: item._id || idx, ...item })));
        } else {
            setRows([]);
        }
    }, [list]);

    useEffect(() => {
        if (subscriptionList.length) {
            setSubs(subscriptionList);
        }
    }, [subs]);

    const handleAdd = () => {
        const newRow = {
            id: Date.now(),
            vehicleNumber: '',
            brand: '',
            model: '',
            color: '',
            block: '',
            parkingNumber: '',
            isNewRow: true,
        };
        setRows((prev) => [...prev, newRow]);
    };

    const handleEditCellChange = (params) => {
        setRows((prev) =>
            prev.map((row) =>
                row.id === params.id
                    ? {
                        ...row,
                        [params.field]: params.value,
                    }
                    : row
            )
        );
    };

    const handleSave = (payload) => {
        const postBoady = {
            vehicleNumber: payload.vehicleNumber,
            brand: payload.brand,
            model: payload.model,
            color: payload.color,
            block: payload.block,
            parkingNumber: payload.parkingNumber,
            customerId: data?._id
        }
        if (payload.isNewRow) {
            dispatch(addVehicles(postBoady));
        } else {
            dispatch(updateVehicles({ payload: postBoady, id: payload._id }))
        }
    };

    const handleDelete = (params) => {
        dispatch(deleteVehicles({ id: params?._id, customerId: data?._id }));
    };

    const renderActionsCell = (params) => {
        return (<>
            <IconButton onClick={() => {
                handleSave(params.row);
            }}>
                <SaveOutlined />
            </IconButton>
            <IconButton
                disabled={params.row.isNewRow}
                onClick={() => {
                    handleDelete(params.row);
                }}>
                <DeleteOutline />
            </IconButton>
        </>
        );
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Stack direction="row" justifyContent="space-between" mb={2}>
                    <Typography variant="h6">Manage Customer Vehicles & Subscription</Typography>
                    <IconButton onClick={handleClose}>
                        <CloseOutlined />
                    </IconButton>
                </Stack>

                <Box mb={2} display="flex" justifyContent="space-between" width={'30%'}>
                    <Box sx={{ cursor: 'pointer' }} onClick={!rows.find((item) => item.isNewRow) ? handleAdd : undefined}>
                        <IconButton disabled={!!rows.find((item) => item.isNewRow)}>
                            <AddCircleOutline />
                        </IconButton>
                        Vehicle
                    </Box>

                    <Box style={{ cursor: 'pointer' }} onClick={() => {
                        setShowCustomerSubModal(true);
                    }}>
                        <IconButton>
                            <ManageAccounts />
                        </IconButton>
                        Manage Subscription
                    </Box>
                </Box>
                <Box sx={{ height: '30vh', width: '90%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns(renderActionsCell)}
                        disableRowSelectionOnClick
                        editMode="cell"
                        height={'50vh'}
                        disableStickyHeader={false}
                        onCellEditCommit={handleEditCellChange}
                        getRowId={(row) => row.id}
                        hideFooter
                        sx={{
                            borderRadius: 2,
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f5f5f5',
                            },
                        }}
                        localeText={{
                            noRowsLabel: 'No vehicles found.',
                        }}
                    />
                </Box>
                <Box mt={2} display="flex" justifyContent="space-between" width={'30%'}>
                    <Box>
                        <IconButton>
                            <ManageAccounts />
                        </IconButton>
                        My Current Subscriptions
                    </Box>
                </Box>
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Plan</strong></TableCell>
                                <TableCell><strong>Price</strong></TableCell>
                                <TableCell><strong>Plan for</strong></TableCell>
                                <TableCell><strong>Wash Quota</strong></TableCell>
                                <TableCell><strong>Remaining Wash Quota</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {subs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No Subscriptions found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                subs.map((sub) => {
                                    return (
                                        <TableRow key={sub.id}>
                                            {/* Plan Select */}
                                            <TableCell>
                                                {sub?.planId?.name}
                                            </TableCell>

                                            {/* Price */}
                                            <TableCell>₹{sub?.planId?.price || '--'}</TableCell>

                                            {/* Vehicle Type */}
                                            <TableCell>
                                                {sub?.planId?.vehicleType === 1 ? (
                                                    <IconButton><LocalCarWash /></IconButton>
                                                ) : sub?.planId?.vehicleType === 2 ? (
                                                    <IconButton><TwoWheelerRounded /></IconButton>
                                                ) : '--'}
                                            </TableCell>

                                            {/* Quota */}
                                            <TableCell>
                                                <Typography variant="body2">Foam: {sub?.washQuota?.foam || '--'}</Typography>
                                                <Typography variant="body2">Normal: {sub?.washQuota?.normal || '--'}</Typography>
                                            </TableCell>

                                            {/* Remaining Quota */}
                                            <TableCell>
                                                <Typography variant="body2">Foam: {sub?.washQuota?.foam  ? (sub?.washQuota?.foam - sub?.washesUsed?.foam) : '--'}</Typography>
                                                <Typography variant="body2">Normal: {sub?.washQuota?.normal ? (sub?.washQuota?.normal - sub?.washesUsed?.normal) : '--'}</Typography>
                                            </TableCell>

                                            {/* Vehicle Selector */}
                                            <TableCell>
                                            <Typography variant="body2">{sub.status?.toUpperCase()}</Typography>
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell align="center">
                    
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>

                    </Table>
                </TableContainer>
                {showCustomerSubModal && <SubscriptionModal
                    open={showCustomerSubModal}
                    customerDetails={data}
                    handleClose={() => {
                        setShowCustomerSubModal(false);
                    }}
                />}
            </Box>
        </Modal>
    );
};

export default CustomerSubscriptionModal;
