import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AddHomeIcon from "@mui/icons-material/AddHome";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Kiểm tra user đăng nhập
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored) setUser(stored);
  }, []);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    handleMenuClose();
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={3}
      sx={{
        backgroundColor: "#fff",
        color: "#1976d2",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Toolbar>
        {/* Logo bên trái */}
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <AddHomeIcon sx={{ mr: 1, fontSize: 28 }} color="primary" />
          <Typography
            variant="h6"
            fontWeight={700}
            color="primary"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              "&:hover": { color: "#1565c0" },
            }}
          >
            PhongTro123
          </Typography>
        </Box>

        {/* Menu chính (giữa) */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          <Button component={Link} to="/" sx={{ color: "#1976d2", fontWeight: 600 }}>
            Trang chủ
          </Button>
          <Button component={Link} to="/post-room" sx={{ color: "#1976d2", fontWeight: 600 }}>
            Đăng tin
          </Button>
          <Button component={Link} to="/profile" sx={{ color: "#1976d2", fontWeight: 600 }}>
            Trang cá nhân
          </Button>
        </Box>

        {/* Bên phải: Avatar / Đăng nhập */}
        {user ? (
          <>
            <Tooltip title="Tài khoản của bạn">
              <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
                <Avatar
                  src={user.avatar || "https://i.pravatar.cc/100"}
                  alt={user.name}
                  sx={{ width: 38, height: 38 }}
                />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 4,
                sx: { borderRadius: 2, mt: 1 },
              }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography fontWeight={600}>{user.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                Trang cá nhân
              </MenuItem>
              <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/login"
            sx={{
              borderRadius: "20px",
              px: 3,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Đăng nhập
          </Button>
        )}

        {/* Nút menu mobile */}
        <Box sx={{ display: { xs: "block", md: "none" }, ml: 1 }}>
          <IconButton color="primary">
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
