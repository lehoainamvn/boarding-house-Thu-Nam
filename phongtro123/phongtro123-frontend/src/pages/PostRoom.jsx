import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Avatar,
  Divider,
} from "@mui/material";
import api from "../api";

export default function PostRoom() {
  const [form, setForm] = useState({
    title: "",
    price: "",
    address: "",
    description: "",
    image: "",
  });

  // ✅ Lưu dữ liệu khi nhập form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Xử lý khi bấm "Đăng tin"
  const handleSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("⚠️ Vui lòng đăng nhập trước khi đăng tin!");
        return;
      }

      const payload = { ...form, user_id: user.id };
      console.log("📤 Gửi dữ liệu đăng tin:", payload);

      const res = await api.post("/rooms", payload);
      alert("✅ " + res.data.message);

      // Reset form
      setForm({
        title: "",
        price: "",
        address: "",
        description: "",
        image: "",
      });
    } catch (err) {
      console.error("❌ Lỗi khi đăng phòng:", err);
      alert("❌ Có lỗi khi đăng tin, xem log để biết thêm chi tiết!");
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
        py: 5,
      }}
    >
      <Container maxWidth="sm">
        {/* Khung chính */}
        <Paper
          elevation={4}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: "#fff",
          }}
        >
          {/* Header */}
          <Typography
            variant="h6"
            fontWeight={700}
            textAlign="center"
            sx={{ mb: 2 }}
          >
            🏠 Đăng tin phòng trọ
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* Avatar + Form */}
          <Box display="flex" gap={2}>
            <Avatar
              alt="User"
              src="https://i.pravatar.cc/100"
              sx={{ width: 50, height: 50 }}
            />
            <Box flex={1}>
              <TextField
                fullWidth
                placeholder="🖊️ Nhập tiêu đề phòng..."
                name="title"
                value={form.title}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  mb: 2,
                  backgroundColor: "#f9f9f9",
                  borderRadius: "10px",
                }}
              />
              <TextField
                fullWidth
                placeholder="💬 Mô tả chi tiết phòng, tiện nghi..."
                name="description"
                multiline
                rows={3}
                value={form.description}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  mb: 2,
                  backgroundColor: "#f9f9f9",
                  borderRadius: "10px",
                }}
              />
              <TextField
                fullWidth
                placeholder="💸 Giá thuê (VND/tháng)"
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                placeholder="📍 Địa chỉ phòng trọ"
                name="address"
                value={form.address}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                placeholder="🖼️ Ảnh (URL)"
                name="image"
                value={form.image}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />

              {/* Preview ảnh */}
              {form.image && (
                <Box
                  sx={{
                    mt: 2,
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: 2,
                  }}
                >
                  <img
                    src={form.image}
                    alt="preview"
                    style={{
                      width: "100%",
                      height: "240px",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}

              {/* Nút Đăng */}
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.2,
                  borderRadius: "30px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  background:
                    "linear-gradient(90deg, #1976D2 0%, #42A5F5 100%)",
                  ":hover": {
                    background: "linear-gradient(90deg, #1565C0, #2196F3)",
                  },
                }}
                onClick={handleSubmit}
              >
                📢 Đăng tin
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
