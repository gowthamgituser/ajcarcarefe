import {
    Box,
    Typography,
    Modal,
    IconButton,
    Divider,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    CircularProgress,
    Paper
  } from "@mui/material";
  import { CloseOutlined } from "@mui/icons-material";
  import { useDispatch, useSelector } from "react-redux";
  import { useEffect } from "react";
  import { fetchCustomerInvoice } from "../../redux/actions/invoice";
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    maxWidth: 800,
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: '#fff',
    borderRadius: 2,
    boxShadow: 24,
    p: 3
  };
  
  const DetailedInvoice = ({ open, handleClose, data }) => {
    const dispatch = useDispatch();
    const { customerInvoice, customerInvoiceLoading } = useSelector(state => state.invoice);
  
    useEffect(() => {
      if (open && data?.customerId && data?.month && data?.year) {
        dispatch(fetchCustomerInvoice({
          id: data.customerId,
          month: data.month,
          year: data.year
        }));
      }
    }, [open]);
  
    return (
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Customer Invoice</Typography>
            <IconButton onClick={handleClose}><CloseOutlined /></IconButton>
          </Box>
  
          {customerInvoiceLoading ? (
            <Box display="flex" justifyContent="center" py={5}>
              <CircularProgress />
            </Box>
          ) : customerInvoice ? (
            <>
              {/* Header Details */}
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography><strong>Invoice ID:</strong> {customerInvoice.invoiceId}</Typography>
                  {/* <Typography><strong>Date:</strong> {new Date().toLocaleDateString()}</Typography> */}
                </Box>
                <Typography><strong>Name:</strong> {customerInvoice.name}</Typography>
                <Typography><strong>Phone:</strong> {customerInvoice.phone}</Typography>
                <Typography><strong>Month:</strong> {customerInvoice.month} / {customerInvoice.year}</Typography>
              </Paper>
  
              {/* Subscriptions */}
              <Typography variant="subtitle1" mb={1}><strong>Subscriptions</strong></Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Plan Name</strong></TableCell>
                    <TableCell align="right"><strong>Price (₹)</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {(customerInvoice?.subscriptions || []).map((sub) => (
      <TableRow key={sub._id}>
        <TableCell>{sub.planName}</TableCell>
        <TableCell align="right">₹{sub.planPrice}</TableCell>
      </TableRow>
    ))}
                </TableBody>
              </Table>
  
              {/* Wash Logs */}
              <Typography variant="subtitle1" mt={4} mb={1}><strong>Wash Logs</strong></Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Type</strong></TableCell>
                    <TableCell><strong>Is Additional</strong></TableCell>
                    <TableCell align="right"><strong>Charge (₹)</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(customerInvoice.logs||[]).map((log, index) => (
                    <TableRow key={log._id || index}>
                      <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                      <TableCell>{log.type}</TableCell>
                      <TableCell>{log.isAdditional ? "Yes" : "No"}</TableCell>
                      <TableCell align="right">{log.additionalCharge || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
  
              {/* Amount Summary */}
              {/* <Divider sx={{ my: 3 }} /> */}
              <Box display="flex" justifyContent="flex-end" flexDirection="column" alignItems="end" gap={1}>
                <Typography><strong>Plan Total:</strong> ₹{customerInvoice.planTotal}</Typography>
                <Typography><strong>Additional Total:</strong> ₹{customerInvoice.additionalTotal}</Typography>
                <Typography variant="h6"><strong>Grand Total:</strong> ₹{customerInvoice.amount}</Typography>
              </Box>
  
              {/* Payment Status */}
              <Divider sx={{ my: 3 }} />
              <Box>
                <Typography><strong>Payment Status:</strong> {customerInvoice?.paymentStatus?.toUpperCase()||'-'}</Typography>
                {customerInvoice.paymentStatus === 'paid' && (
                  <>
                    <Typography><strong>Paid On:</strong> {new Date(customerInvoice.paymentDate).toLocaleDateString()}</Typography>
                    {/* <Typography><strong>Last Updated:</strong> {new Date(customerInvoice.paymentUpdatedAt).toLocaleDateString()}</Typography> */}
                  </>
                )}
              </Box>
            </>
          ) : (
            <Typography color="error">No invoice found.</Typography>
          )}
        </Box>
      </Modal>
    );
  };
  
  export default DetailedInvoice;
  