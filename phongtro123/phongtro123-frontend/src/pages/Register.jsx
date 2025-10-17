import React, { useState } from "react";
import api from "../api";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    try {
      await api.post("/register", { name, email, password });
      alert("✅ Đăng ký thành công!");
      window.location.href = "/login";
    } catch (err) {
      alert("❌ Email đã tồn tại hoặc lỗi hệ thống!");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        background: "linear-gradient(135deg, #E3F2FD, #BBDEFB, #90CAF9)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          width: 380,
          borderRadius: 4,
          textAlign: "center",
          backdropFilter: "blur(8px)",
        }}
      >
        <Typography variant="h4" fontWeight={700} color="primary" sx={{ mb: 2 }}>
          ✨ Đăng ký tài khoản
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Tạo tài khoản để đăng và quản lý phòng trọ của bạn
        </Typography>

        {/* Họ tên */}
        <TextField
          fullWidth
          label="Họ và tên"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />

        {/* Email */}
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />

        {/* Mật khẩu */}
        <TextField
          fullWidth
          label="Mật khẩu"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color="primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Nút đăng ký */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{
            mt: 4,
            borderRadius: "30px",
            py: 1.3,
            fontSize: "1rem",
            fontWeight: 600,
            textTransform: "none",
            background:
              "linear-gradient(90deg, #1976D2 0%, #42A5F5 100%)",
            ":hover": {
              background: "linear-gradient(90deg, #1565C0, #2196F3)",
            },
          }}
          onClick={handleRegister}
        >
          Đăng ký
        </Button>

        {/* Link chuyển sang đăng nhập */}
        <Typography sx={{ mt: 3 }} color="text.secondary" variant="body2">
          Đã có tài khoản?{" "}
          <a
            href="/login"
            style={{
              color: "#1976D2",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Đăng nhập ngay
          </a>
        </Typography>
      </Paper>
    </Box>
  );
}
