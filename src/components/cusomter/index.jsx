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
import { fetchCustomer } from "../../redux/actions/customers";
import { useParams } from "react-router-dom";
import CustomerModal from "./customerModal";
const Customer = () => {
    const dispatch = useDispatch();
    const { list, loading } = useSelector((state) => state.customer);
    const [showModal, setShowModal] = useState({open: false, data: null})
    const [showEditModal, setShowEditModal] = useState({ open: false, data: null });

    const { id } = useParams();
    useEffect(() => {
        if (id) {
          dispatch(fetchCustomer(id));
        }
      }, [dispatch, id]);
    return (
        <>
          {/* Main Content */}
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h5">Customers</Typography>
              <Button
                variant="contained"
                onClick={() => setShowModal({
                  open: true, data: {
                    apartmentId: id
                  }
                })}
              >
                Add Customers
              </Button>
            </Box>
    
            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell><strong>#</strong></TableCell>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Phone</strong></TableCell>
                    <TableCell><strong>Block No.</strong></TableCell>
                    <TableCell><strong>Flat No.</strong></TableCell>
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
              ) : list.length > 0 ? (
                    list.map((customer, index) => (
                      <TableRow key={customer._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>{customer.blockNumber}</TableCell>
                        <TableCell>{customer.flatNumber}</TableCell>
                        <TableCell>
                          <IconButton color="primary" 
                            onClick={() => {
                              setShowEditModal({
                                open: true,
                                data: customer
                              })
                            }}
                          >
                            <EditNoteOutlined />
                          </IconButton>
                          <IconButton color="primary" 
                          >
                            <ManageAccounts />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ): (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No Customers found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
    
          {showModal.open && <CustomerModal
            data={showModal.data}
            open={showModal.open}
            handleClose={() => setShowModal({ open: false, data: null })}
          />}
          {
            showEditModal.open && <CustomerModal
              data={showEditModal.data}
              open={showEditModal.open}
              editModal={true}
              handleClose={() => setShowEditModal({ open: false, data: null})}
            />
          }
        </>
      );
};

export default Customer;