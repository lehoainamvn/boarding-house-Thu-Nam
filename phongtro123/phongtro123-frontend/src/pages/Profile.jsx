import React, { useEffect, useState } from "react";
import {
  Typography,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Divider,
  Paper,
  Avatar,
  Grid,
} from "@mui/material";
import api from "../api";

export default function Profile() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [user, setUser] = useState(null);

  // ✅ Lấy user từ localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setForm({
        name: storedUser.name ?? "",
        email: storedUser.email ?? "",
        password: "",
      });

      api
        .get(`/rooms/user/${storedUser.id}`)
        .then((res) => setRooms(res.data))
        .catch((err) => console.error("❌ Lỗi lấy phòng:", err));
    }
  }, []);

  // ✅ Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Cập nhật thông tin người dùng
  const handleUpdate = async () => {
    if (!user) return;
    try {
      const res = await api.put(`/update/${user.id}`, form);
      alert(res.data.message);

      const updatedUser = {
        ...user,
        name: form.name,
        email: form.email,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      console.error("❌ Lỗi cập nhật user:", err);
      alert("Không thể cập nhật thông tin!");
    }
  };

  if (!user) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          ⚠️ Bạn cần đăng nhập để xem trang cá nhân.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      {/* ====== ẢNH COVER + AVATAR ====== */}
      <Box
        sx={{
          position: "relative",
          height: 220,
          borderRadius: 3,
          background:
            "linear-gradient(120deg, #64b5f6, #42a5f5, #2196f3, #1e88e5)",
          mb: 10,
        }}
      >
        {/* Avatar */}
        <Avatar
          alt={user.name}
          src={user.avatar || "https://i.pravatar.cc/150?img=3"}
          sx={{
            width: 120,
            height: 120,
            border: "4px solid white",
            position: "absolute",
            bottom: -60,
            left: 40,
            boxShadow: 3,
          }}
        />
      </Box>

      {/* ====== THÔNG TIN NGƯỜI DÙNG ====== */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={4}
            sx={{ p: 3, borderRadius: 3, textAlign: "center", mt: -6 }}
          >
            <Typography variant="h5" fontWeight={700}>
              {form.name || "Người dùng"}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {form.email}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
              ⚙️ Cập nhật thông tin
            </Typography>
            <TextField
              label="Tên"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Mật khẩu mới"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, borderRadius: 2, textTransform: "none" }}
              onClick={handleUpdate}
            >
              💾 Lưu thay đổi
            </Button>
          </Paper>
        </Grid>

        {/* ====== DANH SÁCH PHÒNG ====== */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
            🏠 Phòng bạn đã đăng
          </Typography>

          {rooms.length === 0 ? (
            <Typography color="text.secondary">
              Bạn chưa đăng phòng nào.
            </Typography>
          ) : (
            rooms.map((r) => (
              <Card
                key={r.id}
                sx={{
                  mb: 3,
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={
                      r.image ||
                      "https://images.unsplash.com/photo-1560185127-6a8c6f6cc6d4?w=600"
                    }
                    alt={r.title}
                    style={{
                      width: 140,
                      height: 110,
                      objectFit: "cover",
                    }}
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6">{r.title}</Typography>
                    <Typography color="text.secondary">
                      📍 {r.address}
                    </Typography>
                    <Typography color="primary" fontWeight={600}>
                      💰 {r.price?.toLocaleString()}₫ / tháng
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {r.description}
                    </Typography>
                  </CardContent>
                </Box>
              </Card>
            ))
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
