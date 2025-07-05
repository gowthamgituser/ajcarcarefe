import React, { useEffect, useState } from "react";
import {
    Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSubscriptionByApartment, reactivateSubscriptions } from "../../redux/actions/subscription";

// Reusable component to show collapsible row
const CollapseRow = ({ label, subscriptions }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell colSpan={3}>
          <Typography variant="subtitle1">{label}</Typography>
        </TableCell>
        <TableCell align="right">{subscriptions.length} Subscriptions</TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Customer</strong></TableCell>
                    <TableCell><strong>Phone</strong></TableCell>
                    <TableCell><strong>Vehicle(s)</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subscriptions.map((sub, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{sub.customerId?.name}</TableCell>
                      <TableCell>{sub.customerId?.phone}</TableCell>
                      <TableCell>
                        {(sub.vehicleIds || []).map(v => v?.vehicleNumber).join(", ")}
                      </TableCell>
                      <TableCell>{sub.status.toUpperCase()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const CollapseRowAllSubscription = ({ label, subscriptions }) => {
    const [open, setOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const allIds = subscriptions.filter(id => id.status === 'expired').map((sub) => sub._id);
    const dispatch = useDispatch();
    const { id } = useParams();
    const isAllSelected = selectedIds.length === allIds.length;
  
    const toggleSelectAll = () => {
      if (isAllSelected) {
        setSelectedIds([]);
      } else {
        setSelectedIds(allIds);
      }
    };
  
    const handleToggleOne = (id) => {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    };

    const renewSubscriptions = () => {
        dispatch(reactivateSubscriptions({payload: {subscriptionIds: selectedIds}, id}));
        setSelectedIds([]);
    };

    return (
      <>
        <TableRow>
          <TableCell>
            <IconButton size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
          <TableCell colSpan={3}>
            <Typography variant="subtitle1">{label}</Typography>
          </TableCell>
          <TableCell align="right">{subscriptions.length} Subscriptions</TableCell>
        </TableRow>
  
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1}} gap={2}>
                  {allIds.length > 0 && <Button
                    size="small"
                    variant="contained" color="primary"
                    onClick={toggleSelectAll}
                  >
                    {isAllSelected ? "Remove All" : "Select All"}
                  </Button>}
                  <Button
                    disabled={selectedIds.length === 0}
                    size="small"
                    variant="contained" color="primary"
                    onClick={()=>{
                        renewSubscriptions();
                    }}
                  >
                    {'Renew'}
                  </Button>
                </Box>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Customer</strong></TableCell>
                      <TableCell><strong>Phone</strong></TableCell>
                      <TableCell><strong>Vehicle(s)</strong></TableCell>
                      <TableCell><strong>Plan</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Renew</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subscriptions.map((sub, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{sub.customerId?.name}</TableCell>
                        <TableCell>{sub.customerId?.phone}</TableCell>
                        <TableCell>
                          {(sub.vehicleIds || []).map(v => v?.vehicleNumber).join(", ")}
                        </TableCell>
                        <TableCell>{sub.planId.name}</TableCell>
                        <TableCell>{sub.status.toUpperCase()}</TableCell>
                        <TableCell>
                          {sub.status === 'expired' && <Checkbox
                            checked={selectedIds.includes(sub._id)}
                            onChange={() => handleToggleOne(sub._id)}
                          />}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  };

const Subscriptions = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { list_subscription_apartment, loading } = useSelector(state => state.subscription);

  const [grouped, setGrouped] = useState({});
  const [allSubs, setAllSubs] = useState([]);

  useEffect(() => {
    if (id) dispatch(fetchSubscriptionByApartment(id));
  }, [dispatch, id]);

  useEffect(() => {
    const { subscriptions } = list_subscription_apartment || {};
    if (subscriptions?.length) {
      setAllSubs(subscriptions);
      const groupedByPlan = {};
      subscriptions.forEach(sub => {
        const planName = sub.planId?.name || "Unknown Plan";
        if (!groupedByPlan[planName]) groupedByPlan[planName] = [];
        groupedByPlan[planName].push(sub);
      });
      setGrouped(groupedByPlan);
    }
  }, [list_subscription_apartment]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Subscription Summary</Typography>

      <Backdrop open={loading} sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {!loading && (
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {/* All Subscriptions Collapse Row */}
              {allSubs.length > 0 && (
                <CollapseRowAllSubscription label="All Subscriptions" subscriptions={allSubs} />
              )}

              {/* Plan-wise Collapse Rows */}
              {Object.entries(grouped).map(([plan, subs]) => (
                <CollapseRow key={plan} label={plan} subscriptions={subs} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Subscriptions;
