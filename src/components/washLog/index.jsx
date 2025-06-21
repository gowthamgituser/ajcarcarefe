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
import { EditNoteOutlined, ManageAccounts, StartOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CustomerModal from "../cusomter/customerModal";
import AddWashLogs from "./AddWashLogs";
import { fetchWashLogByApartment } from "../../redux/actions/washLog";
import { format } from "date-fns";
const WashLogs = () => {
    const dispatch = useDispatch();
    const { list_apartment, loading } = useSelector((state) => state.washLog);
    const [showModal, setShowModal] = useState({ open: false, data: null })
    const [showEditModal, setShowEditModal] = useState({ open: false, data: null });
    const [showCustomerSubModal, setShowCustomerSubModal] = useState({ open: false, data: null });

    const { id } = useParams();
    useEffect(() => {
        if (id) {
            dispatch(fetchWashLogByApartment(id));
        }
    }, [dispatch, id]);

    console.log(list_apartment);

    return (
        <>
            {/* Main Content */}
            <Box sx={{ p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="h5">Wash Logs</Typography>
                    <Button
                        variant="contained"
                        onClick={() => setShowModal({
                            open: true, data: {
                                apartmentId: id
                            }
                        })}
                    >
                        Add Wash
                    </Button>
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
                                <TableCell><strong>Additional Wash & Charge</strong></TableCell>
                                <TableCell><strong>Wash Done on</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
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
                                        <TableCell> {wash?.createdAt ? format(new Date(wash.createdAt), 'dd MMM yyyy, h:mm a') : '--'}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
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
                handleClose={() => setShowModal({ open: false, data: null })}
            />}
            {
                showEditModal.open && <AddWashLogs
                    data={showEditModal.data}
                    open={showEditModal.open}
                    editModal={true}
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
        </>
    );
};

export default WashLogs;