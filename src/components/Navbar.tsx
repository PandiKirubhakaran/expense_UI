import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useThemeContext } from "../theme/ThemeProvider";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { useAuth } from "../context/AuthProvider"; // Import useAuth

const Navbar: React.FC = () => {
  const { toggleTheme, isDarkMode } = useThemeContext();
  const { isAuthenticated, logout } = useAuth(); // Use isAuthenticated and logout from AuthProvider
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleLogout = () => {
    logout(); // Log the user out
    navigate("/login"); // Redirect to login page
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            maxWidth: "1280px",
            margin: "0 auto",
          }}
        >
          {/* Left side: Logo, Dashboard, and Expenses */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" component="div" sx={{ mr: 2,color:'yellow'}}>
              Kirubha's Expense Tracker
            </Typography>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{ textDecoration: "none", color: "inherit", mr: 2 }}
            >
              Dashboard
            </Typography>
            <Typography
              variant="h6"
              component={Link}
              to="/expenses"
              sx={{ textDecoration: "none", color: "inherit" }}
            >
              Expenses
            </Typography>
          </Box>

          {/* Right side: SignIn, SignUp, Theme Toggle, Profile */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {!isAuthenticated ? (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Sign In
                </Button>
                <Button color="inherit" component={Link} to="/signup">
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                {/* <IconButton color="inherit" component={Link} to="/profile">
                  <AccountCircle />
                </IconButton> */}
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}

            <IconButton color="inherit" onClick={toggleTheme}>
              {isDarkMode ? (
                <Brightness7Icon sx={{ color: "yellow" }} />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
