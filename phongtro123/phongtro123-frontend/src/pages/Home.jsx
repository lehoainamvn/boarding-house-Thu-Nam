import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  TextField,
  InputAdornment,
  Box,
  Avatar,
  Divider,
  Paper,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const navigate = useNavigate();

  // 🔹 Lấy dữ liệu từ backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/rooms");
        setRooms(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách phòng:", err);
      }
    };
    fetchRooms();
  }, []);

  // 🔹 Lọc theo từ khóa
  useEffect(() => {
    const result = rooms.filter(
      (r) =>
        r.title?.toLowerCase().includes(search.toLowerCase()) ||
        r.address?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, rooms]);

  return (
    <Box sx={{ backgroundColor: "#f0f2f5", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="sm">
        {/* Ô tìm kiếm */}
        <Paper
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 4,
            boxShadow: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <SearchIcon color="primary" />
          <TextField
            fullWidth
            placeholder="Tìm kiếm phòng trọ theo tiêu đề hoặc địa chỉ..."
            variant="standard"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ disableUnderline: true }}
          />
        </Paper>

        {/* Feed danh sách phòng */}
        {filtered.length === 0 ? (
          <Typography textAlign="center" color="text.secondary">
            😕 Không tìm thấy phòng nào phù hợp.
          </Typography>
        ) : (
          filtered.map((room) => (
            <Paper
              key={room.id}
              elevation={3}
              sx={{
                mb: 4,
                borderRadius: 4,
                overflow: "hidden",
                backgroundColor: "#fff",
                transition: "0.2s",
                "&:hover": { boxShadow: 6 },
              }}
            >
              {/* Header bài đăng */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                }}
              >
                <Avatar
                  src={room.user?.avatar || "https://i.pravatar.cc/100"}
                  alt={room.user?.name || "User"}
                  sx={{ width: 48, height: 48, mr: 2 }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {room.user?.name || "Người dùng"}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="caption" color="text.secondary">
                      {room.created_at
                        ? new Date(room.created_at).toLocaleString()
                        : "Vừa đăng"}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider />

              {/* Nội dung bài đăng */}
              <Box
                onClick={() => navigate(`/room/${room.id}`)}
                sx={{
                  cursor: "pointer",
                }}
              >
                {/* Tiêu đề */}
                <CardContent sx={{ pb: 0 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                    {room.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                    {room.description}
                  </Typography>

                  {/* Ảnh */}
                  {room.image && (
                    <CardMedia
                      component="img"
                      height="300"
                      image={room.image}
                      alt={room.title}
                      sx={{
                        objectFit: "cover",
                        borderRadius: "10px",
                        boxShadow: 2,
                        mb: 2,
                      }}
                    />
                  )}

                  {/* Địa chỉ + Giá */}
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocationOnIcon color="action" fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        {room.address}
                      </Typography>
                    </Box>
                    <Chip
                      label={`💰 ${room.price?.toLocaleString()} VND/tháng`}
                      color="primary"
                      sx={{
                        fontWeight: 600,
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                      }}
                    />
                  </Box>
                </CardContent>
              </Box>

              <Divider sx={{ mt: 2 }} />

              {/* Footer (like/share mô phỏng) */}
              <Box
                display="flex"
                justifyContent="space-around"
                sx={{ py: 1.5, color: "text.secondary" }}
              >
       
              </Box>
            </Paper>
          ))
        )}
      </Container>
    </Box>
  );
}
