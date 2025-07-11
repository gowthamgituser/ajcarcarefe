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
    MenuItem,
    Tooltip
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { downloadCustomerInvoice, fetchInvoice } from "../../redux/actions/invoice";
import { getMonthName } from "../../utils/getMonth";
import '../invoice/index.css';
import { GridMoreVertIcon } from "@mui/x-data-grid";
import StatusModal from "./statusModal";
import { format } from "date-fns";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DetailedInvoice from "./detailedInvoice";

const Invoice = () => {
    const dispatch = useDispatch();
    const { list: invoice_list, loading } = useSelector((state) => state.invoice);
    const [invoiceRecord, setInvoiceRecord] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [statusModal, setStatusModal] = useState({
        open: false,
        data: null
    });
    const [invoiceModal, setInvoiceModal] = useState({
        open: false,
        data: null
    });
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedItem, setSelectedItem] = useState(null);

    const { id } = useParams();

    useEffect(() => {
        if (id) {
            const month = selectedDate.getMonth() + 1;
            const year = selectedDate.getFullYear();
            dispatch(fetchInvoice({ id, month, year }));
        }
    }, [dispatch, id, selectedDate]);


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

    useEffect(() => {
        console.log(selectedDate);
    }, [selectedDate]);

    return (
        <>
            <Box sx={{ p: 2 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                        flexWrap: "wrap",
                        gap: 2,
                    }}
                >
                    <Typography variant="h5">Invoices</Typography>

                    <Box sx={{ minWidth: 200 }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                views={["year", "month"]}
                                value={selectedDate}
                                onChange={(newValue) => setSelectedDate(newValue)}
                                slotProps={{
                                    textField: {
                                        size: "small",
                                        fullWidth: true,
                                    },
                                }}
                            />
                        </LocalizationProvider>
                    </Box>
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
                                <TableCell><strong>Payment Status</strong></TableCell>
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
                                            <Tooltip title={item.statusNotes || ''}><Box className='invoice-box' style={{ backgroundColor: item.paymentStatus === 'paid' ? 'lightgreen' : '#FFCCCB', color: item.paymentStatus === 'paid' ? 'green' : 'red' }}>
                                                {item.paymentStatus?.toUpperCase()}
                                            </Box></Tooltip>

                                        </TableCell>
                                        <TableCell>{item?.paymentDate && item?.paymentStatus === 'paid' ? format(new Date(item.paymentDate), 'dd MMM yyyy, h:mm a') : '--'}</TableCell>
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
                                                    setInvoiceModal({
                                                        open: true,
                                                        data: selectedItem,
                                                    });
                                                    handleClose();
                                                }}>
                                                    <strong>View Invoice</strong>
                                                </MenuItem>
                                                <MenuItem onClick={() => {
                                                    setStatusModal({
                                                        open: true,
                                                        data: selectedItem,
                                                    });
                                                    handleClose();
                                                }}>
                                                    <strong>Update Payment</strong>
                                                </MenuItem>
                                                <MenuItem onClick={() => {
                                                    handleClose();
                                                }}>
                                                    <strong>Send Invoice</strong>
                                                </MenuItem>
                                                <MenuItem onClick={() => {
                                                    dispatch(downloadCustomerInvoice(selectedItem.customerId))
                                                    handleClose();
                                                }}>
                                                    <strong>Download Invoice</strong>
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
            {invoiceModal.open && <DetailedInvoice
                data={invoiceModal.data}
                open={invoiceModal.open}
                handleClose={() => setInvoiceModal({ open: false, data: null })}
            />}
        </>
    );
};

export default Invoice;