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
import { EditNoteOutlined, LocalCarWash, StartOutlined, TwoWheeler } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchplans } from "../../redux/actions/plans";
import AddPlanModal from "./addplanmodal";
const Plans = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.plan);
  const [showModal, setShowModal] = useState({ open: false, data: null });
  const [showEditModal, setShowEditModal] = useState({ open: false, data: null });


  const { id } = useParams();
  useEffect(() => {
    if (id) {
      dispatch(fetchplans(id));
    }
  }, [dispatch, id]);
  return (
    <>
      {/* Main Content */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h5">Wash plans</Typography>
          <Button
            variant="contained"
            onClick={() => setShowModal({
              open: true, data: {
                apartmentId: id
              }
            })}
          >
            Add Plans
          </Button>
        </Box>

        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell><strong>#</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Price</strong></TableCell>
                <TableCell><strong>Wash Quota</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Plan</strong></TableCell>
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
                list.map((plan, index) => (
                  <TableRow key={plan._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{plan.name}</TableCell>
                    <TableCell>{plan.price}</TableCell>
                    <TableCell>
                      <Box>
                        <strong>Foam:</strong> {plan.washQuota?.foam || '-'}
                      </Box>
                      <Box>
                        <strong>Normal:</strong> {plan.washQuota?.normal || '-'}
                      </Box>
                    </TableCell>
                    <TableCell>{plan.description}</TableCell>
                    <TableCell>
                      {
                        plan.vehicleType === 1 ? <>
                        <IconButton>
                          <LocalCarWash/>
                        </IconButton>
                        </> : plan.vehicleType === 2 ? <> 
                        <IconButton>
                        <TwoWheeler/>
                        </IconButton>
                        </> : ''
                      }
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => {
                        setShowEditModal({
                          open: true,
                          data: plan
                        })
                      }}>
                        <EditNoteOutlined />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No plans found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

          </Table>
        </TableContainer>
      </Box>

      {showModal.open && <AddPlanModal
        data={showModal.data}
        open={showModal.open}
        handleClose={() => setShowModal({ open: false, data: null })}
      />}

      {showEditModal.open && <AddPlanModal
        data={showEditModal.data}
        open={showEditModal.open}
        editModal={true}
        handleClose={() => setShowEditModal({ open: false, data: null })}
      />}
    </>
  );
};

export default Plans;