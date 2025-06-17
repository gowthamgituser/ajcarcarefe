/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { EditNoteOutlined, StartOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchApartments } from "../../redux/actions/apartment";
import AddApartmentModal from "./apartmentmodal";
import NavBar from "../navbar/navbar";
import {useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.apartment);
  const [showModal, setShowModal] = useState({ open: false, data: null });
  const [showEditModal, setShowEditModal] = useState({ open: false, data: null})

  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchApartments());
  }, [dispatch]);

  const handleEdit = (apartment) => {
    // Handle edit logic here
  };

  return (
    <>
      {/* Main Content */}
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h5">Apartments</Typography>
          <Button
            variant="contained"
            onClick={() => setShowModal({ open: true, data: null })}
          >
            Add Apartment
          </Button>
        </Box>

        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell><strong>#</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Location</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">Loading...</TableCell>
                </TableRow>
              ) : (
                list.map((apartment, index) => (
                  <TableRow key={apartment._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{apartment.name}</TableCell>
                    <TableCell>{apartment.address}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={()=>{
                        setShowEditModal({
                          open: true,
                          data: apartment
                        })
                      }}>
                        <EditNoteOutlined />
                      </IconButton>
                      <IconButton color="primary" onClick={() => {
                        navigate(`/apartment/${apartment._id}`)
                      }}>
                        <StartOutlined />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {showModal.open && <AddApartmentModal
        open={showModal.open}
        handleClose={() => setShowModal({ open: false, data: null })}
      />}
      {
        showEditModal.open && <AddApartmentModal
        editModal={true}
        data={showEditModal.data}
        open={showEditModal.open}
        handleClose={() => setShowEditModal({ open: false, data: null })}
      />
      }
    </>
  );
};

export default Dashboard;
