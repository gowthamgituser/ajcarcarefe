import React, { useEffect, useState } from "react";
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    CircularProgress,
    IconButton,
    Menu,
    MenuItem
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchInvoice } from "../../redux/actions/invoice";
import { getMonthName } from "../../utils/getMonth";
import '../invoice/index.css';
import { GridMoreVertIcon } from "@mui/x-data-grid";
import StatusModal from "./statusModal";
import { format } from "date-fns";

const Invoice = () => {
    const dispatch = useDispatch();
    const { list: invoice_list, loading } = useSelector((state) => state.invoice);
    const [invoiceRecord, setInvoiceRecord] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [statusModal, setStatusModal] = useState({
        open: false,
        data: null
    });

    const [selectedItem, setSelectedItem] = useState(null);

    const { id } = useParams();

    useEffect(() => {
        if (id) {
            dispatch(fetchInvoice(id));
        }
    }, [dispatch, id]);


    useEffect(() => {
        if (!invoice_list?.invoices?.length) return;
        setInvoiceRecord(invoice_list?.invoices.filter((item) => item.logs.length > 0));
    }, [invoice_list]);

    const handleOpen = (event, item) => {
        setAnchorEl(event.currentTarget);
        setSelectedItem(item);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedItem(null);
    };
    return (
        <>
            {/* Main Content */}
            <Box sx={{ p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="h5">Invoices</Typography>
                </Box>

                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                            <TableRow>
                                <TableCell><strong>Invoice No#</strong></TableCell>
                                <TableCell><strong>Month & Year</strong></TableCell>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Phone</strong></TableCell>
                                <TableCell><strong>Amount</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Payment Done on</strong></TableCell>
                                <TableCell><strong>Action</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <CircularProgress size={28} />
                                    </TableCell>
                                </TableRow>
                            ) : invoiceRecord.length > 0 ? (
                                invoiceRecord.map((item, index) => (
                                    <TableRow key={item.invoiceId + index}>
                                        <TableCell>{item.invoiceId}</TableCell>
                                        <TableCell>{getMonthName(item.month) + ' ' + item.year}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.phone}</TableCell>
                                        <TableCell>{`₹${item.amount.toLocaleString('en-IN')}`}</TableCell>
                                        <TableCell>
                                            <Box className='invoice-box' style={{ backgroundColor: item.paymentStatus === 'paid' ? 'lightgreen' : '#FFCCCB', color: item.paymentStatus === 'paid' ? 'green' : 'red' }}>
                                                {item.paymentStatus?.toUpperCase()}
                                            </Box>

                                        </TableCell>
                                        <TableCell> {item?.paymentDate && item?.paymentStatus === 'paid' ? format(new Date(item.paymentDate), 'dd MMM yyyy, h:mm a') : '--'}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={(e) => handleOpen(e, item)}>
                                                <GridMoreVertIcon />
                                            </IconButton>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl)}
                                                onClose={handleClose}
                                            >
                                                <MenuItem onClick={() => {
                                                    setStatusModal({
                                                        open: true,
                                                        data: selectedItem, // reliable!
                                                    });
                                                    handleClose();
                                                }}>
                                                    <strong>Update Status</strong>
                                                </MenuItem>
                                                <MenuItem onClick={() => {
                                                    // Implement send invoice logic here if needed
                                                    handleClose();
                                                }}>
                                                    <strong>Send Invoice</strong>
                                                </MenuItem>
                                            </Menu>
                                        </TableCell>

                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        No Invoice found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            {statusModal.open && <StatusModal
                data={statusModal.data}
                open={statusModal.open}
                handleClose={() => setStatusModal({ open: false, data: null })}
            />}
        </>
    );
};

export default Invoice;