import React, { useEffect, useState } from "react";
import {
  Box,
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
import { fetchSubscriptionByApartment } from "../../redux/actions/subscription";

// Reusable component to show collapsible row
const CollapseRow = ({ label, subscriptions }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
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
    console.log(subscriptions);
    return (
      <>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
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
                      <TableCell><strong>Plan</strong></TableCell>
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
                        <TableCell>{sub.planId.name}</TableCell>
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

const Subscriptions = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { list_subscription_apartment } = useSelector(state => state.subscription);

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
    </Box>
  );
};

export default Subscriptions;
