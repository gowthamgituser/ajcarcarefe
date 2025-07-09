import React, { useEffect, useState } from "react";
import {
    Button,
    IconButton,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    CircularProgress
} from "@mui/material";
import { DeleteForeverOutlined, EditNoteOutlined, Search, SearchOffOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AddWashLogs from "./AddWashLogs";
import { deleteWashLog, fetchWashLogByApartment } from "../../redux/actions/washLog";
import { format } from "date-fns";
import AlertModal from "../uiComponents/AlertMoidal";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { formatDate } from "../../utils/getMonth";

const WashLogs = () => {
    const dispatch = useDispatch();
    const { list_apartment, loading } = useSelector((state) => state.washLog);
    const [showModal, setShowModal] = useState({ open: false, data: null })
    const [showEditModal, setShowEditModal] = useState({ open: false, data: null });
    const [showCustomerSubModal, setShowCustomerSubModal] = useState({ open: false, data: null });
    // const [showEditWashModal, setShowEditWashModal] = useState({ open: false, data: null });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLog, setDeleteLog] = useState({});
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const { id } = useParams();

    useEffect(() => {
        if (id && startDate && endDate) {
            const formattedStartDate = formatDate(startDate);
            const formattedEndDate = formatDate(endDate);

            dispatch(fetchWashLogByApartment({
                id,
                startDate: formattedStartDate,
                endDate: formattedEndDate
            }));
        }
    }, [dispatch, id]);

    const handleSearch = () => {
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        dispatch(fetchWashLogByApartment({
            id,
            startDate: formattedStartDate,
            endDate: formattedEndDate
        }));
    };

    return (
        <>
            {/* Main Content */}
            <Box sx={{ p: 2 }}>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Wash Logs
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        {/* Left Section */}
                        <Button
                            variant="contained"
                            onClick={() =>
                                setShowModal({
                                    open: true,
                                    data: { apartmentId: id },
                                })
                            }
                            sx={{ minWidth: 120 }}
                        >
                            Add Wash
                        </Button>

                        {/* Right Section */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: 2,
                            }}
                        >
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Start Date"
                                    value={startDate}
                                    onChange={(newValue) => setStartDate(newValue)}
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            sx: { minWidth: 150 },
                                        },
                                    }}
                                />
                            </LocalizationProvider>

                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="End Date"
                                    value={endDate}
                                    onChange={(newValue) => setEndDate(newValue)}
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            sx: { minWidth: 150 },
                                        },
                                    }}
                                />
                            </LocalizationProvider>

                            <IconButton
                                onClick={handleSearch}
                                sx={{
                                    border: "1px solid #ccc",
                                    borderRadius: 1,
                                    p: 1,
                                }}
                            >
                                <Search />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>


                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                            <TableRow>
                                <TableCell><strong>#</strong></TableCell>
                                <TableCell><strong>Customer Name</strong></TableCell>
                                <TableCell><strong>Vehicle Number</strong></TableCell>
                                <TableCell><strong>Brand & Model</strong></TableCell>
                                <TableCell><strong>Block & Parking No.</strong></TableCell>
                                <TableCell><strong>Wash Type</strong></TableCell>
                                <TableCell><strong>Charge</strong></TableCell>
                                <TableCell><strong>Description</strong></TableCell>
                                <TableCell><strong>Wash Done on</strong></TableCell>
                                <TableCell><strong>Action</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={10} align="center">
                                        <CircularProgress size={28} />
                                    </TableCell>
                                </TableRow>
                            ) : list_apartment.length > 0 ? (
                                list_apartment.map((wash, index) => (
                                    <TableRow key={wash._id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{wash.customerId?.name || '---'}</TableCell>
                                        <TableCell>{wash?.vehicleId?.vehicleNumber || (wash?.vehicleId || '---')}</TableCell>
                                        <TableCell>{wash?.vehicleId?.brand || '---'} - {wash?.vehicleId?.model || '---'}</TableCell>
                                        <TableCell>{wash?.vehicleId?.block || '---'} - {wash?.vehicleId?.parkingNumber || '---'}</TableCell>
                                        <TableCell>{wash?.type?.toUpperCase()}</TableCell>
                                        <TableCell>
                                            {wash?.isAdditional ? `₹${wash.additionalCharge.toLocaleString('en-IN')}` : ''}
                                        </TableCell>
                                        <TableCell>{wash?.description}</TableCell>
                                        <TableCell> {wash?.createdAt ? format(new Date(wash.createdAt), 'dd MMM yyyy, h:mm a') : '--'}</TableCell>
                                        <TableCell>
                                            {/* <IconButton color="primary"
                                                onClick={() => {
                                                    setShowEditWashModal({
                                                        open: true,
                                                        data: wash
                                                    })
                                                }}
                                            >
                                                <EditNoteOutlined />
                                            </IconButton> */}
                                            <IconButton color="primary" onClick={() => {
                                                // const postBody = {
                                                //     apartmentId: wash.apartmentId,
                                                //     _id: wash._id
                                                // };
                                                // dispatch(deleteWashLog(postBody))
                                                setDeleteLog(wash);
                                                setShowDeleteModal(true);
                                            }}
                                            >
                                                <DeleteForeverOutlined />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={10} align="center">
                                        No Wash Logs found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {showModal.open && <AddWashLogs
                data={showModal.data}
                open={showModal.open}
                startDate={startDate}
                endDate={endDate}
                handleClose={() => setShowModal({ open: false, data: null })}
            />}
            {
                showEditModal.open && <AddWashLogs
                    data={showEditModal.data}
                    open={showEditModal.open}
                    handleClose={() => setShowEditModal({ open: false, data: null })}
                />
            }
            {
                showCustomerSubModal.open && <CustomerSubscriptionModal
                    data={showCustomerSubModal.data}
                    open={showCustomerSubModal.open}
                    handleClose={() => {
                        setShowCustomerSubModal({ open: false, data: null });
                    }}
                />
            }
            {/* {
                showEditWashModal.open && <EditWashLog
                    data={showEditWashModal.data}
                    open={showEditWashModal.open}
                    editModal={true}
                    handleClose={() => setShowEditWashModal({ open: false, data: null })}
                />
            } */}
            {
                showDeleteModal && <AlertModal
                    open={showDeleteModal}
                    handleClose={() => {
                        setShowDeleteModal(false);
                    }}
                    handleConfirmDelete={() => {
                        const postBody = {
                            apartmentId: deleteLog.apartmentId,
                            _id: deleteLog._id
                        };
                        dispatch(deleteWashLog({ postBody: postBody, startDate, endDate }));
                        setShowDeleteModal(false);
                        setDeleteLog({});
                    }}
                />
            }
        </>
    );
};

export default WashLogs;