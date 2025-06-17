/* eslint-disable react-hooks/exhaustive-deps */
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getApartment } from "../../redux/actions/apartment";

const menuItems = ["Car Wash Logs", "Customer", "Plan", "Invoices"];

const NavBar = ({ onMenuSelect }) => {
  const { apartmentData } = useSelector((state) => state.apartment);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open) => () => setDrawerOpen(open);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getApartment(id));
  }, []);

  const handleMenuClick = (index) => {
    onMenuSelect(index);
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ ml: 2 }}>{apartmentData?.name?.toUpperCase() || ''}</Box>
          </Box>
          <Typography variant="h6" component="div">
            AJ Car Care
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {menuItems.map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={() => handleMenuClick(index)}>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default NavBar;
