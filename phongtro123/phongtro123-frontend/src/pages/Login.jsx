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
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("✅ Đăng nhập thành công!");
      window.location.href = "/";
    } catch (err) {
      alert("❌ Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          width: 380,
          borderRadius: 4,
          textAlign: "center",
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          color="primary"
          sx={{ mb: 2 }}
        >
          🔐 Đăng nhập
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Vui lòng nhập thông tin tài khoản của bạn
        </Typography>

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

        {/* Nút đăng nhập */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{
            mt: 4,
            borderRadius: "30px",
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 600,
            py: 1.2,
            background:
              "linear-gradient(90deg, #1976D2 0%, #42A5F5 100%)",
            ":hover": { background: "linear-gradient(90deg, #1565C0, #2196F3)" },
          }}
          onClick={handleLogin}
        >
          Đăng nhập
        </Button>

        {/* Footer */}
        <Typography sx={{ mt: 3 }} color="text.secondary" variant="body2">
          Chưa có tài khoản?{" "}
          <a
            href="/register"
            style={{
              color: "#1976D2",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Đăng ký ngay
          </a>
        </Typography>
      </Paper>
    </Box>
  );
}
