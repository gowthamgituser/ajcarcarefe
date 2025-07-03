import { CloseOutlined } from "@mui/icons-material";
import { Box, Button, Dialog, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymentStatus, updatePayment } from "../../redux/actions/invoice";

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


const StatusModal = ({ open, handleClose, data }) => {
    const { paymentStatus: list } = useSelector((state) => state.invoice);
    const [paymentStatus, setPaymentStatus] = useState('unpaid');
    const [notes, setNotes] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        const postBody = {
            apartmentId: data?.apartmentId,
            month: data?.month,
            year: data?.year,
            customerId: data?.customerId
        }
        dispatch(fetchPaymentStatus(postBody));
    }, []);

    useEffect(() => {
        if (list?.data?.length) {
            const { status, notes } = list.data[0];
            setPaymentStatus(status);
            setNotes(notes || '');
        } else {
            setPaymentStatus('unpaid');
            setNotes('');
        }
    }, [list]);

    const updatePaymentStatus = () => {
        const postBody = {
            apartmentId: data?.apartmentId,
            month: data?.month,
            year: data?.year,
            customerId: data?.customerId,
            status: paymentStatus,
            notes: notes
        };
        dispatch(updatePayment({ payload: postBody}));
        handleClose();
    };

    return (
        <>
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="h6" mb={3}>{'Update Payment'}</Typography>
                        </Box>
                        <Box>
                            <IconButton onClick={() => {
                                handleClose();
                            }}>
                                <CloseOutlined />
                            </IconButton>
                        </Box>
                    </Box>
                    <Box>
                        <FormControl sx={{
                            width: '50%'
                        }}>
                            <InputLabel id="demo-simple-select-label">Payment</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={paymentStatus}
                                label="Payment"
                                onChange={(e) => {
                                    setPaymentStatus(e.target.value);
                                }}
                            >
                                <MenuItem value={'paid'}>Paid</MenuItem>
                                <MenuItem value={'unpaid'}>Unpaid</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box mt={'2%'}>
                        <FormControl sx={{
                            width: '50%'
                        }}>
                            <Typography fontWeight={500}>Notes</Typography>
                            <TextField
                                value={notes}
                                onChange={(e) => {
                                    setNotes(e.target.value);
                                }}
                            />
                        </FormControl>
                    </Box>
                    <Box style={{
                        display: 'flex', justifyContent:'flex-end'
                    }}>
                        <Button variant="contained" color="primary" onClick={() => {
                            updatePaymentStatus();
                        }}>
                                Update
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default StatusModal;
