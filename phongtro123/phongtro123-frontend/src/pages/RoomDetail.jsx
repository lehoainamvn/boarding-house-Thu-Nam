import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Card, CardMedia, CardContent, Button } from "@mui/material";
import api from "../api";

export default function RoomDetail() {
  const { id } = useParams(); // lấy id phòng từ URL
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);

  useEffect(() => {
    api.get(`/rooms/${id}`)
      .then((res) => setRoom(res.data))
      .catch((err) => {
        console.error("❌ Lỗi lấy chi tiết phòng:", err);
        alert("Không tìm thấy phòng!");
        navigate("/"); // trở lại trang chủ nếu lỗi
      });
  }, [id]);

  if (!room) return <Typography sx={{ mt: 4, textAlign: "center" }}>Đang tải dữ liệu...</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Card sx={{ p: 2 }}>
        {room.image && (
          <CardMedia
            component="img"
            height="300"
            image={room.image}
            alt={room.title}
            sx={{ borderRadius: 2, objectFit: "cover" }}
          />
        )}

        <CardContent>
          <Typography variant="h5" gutterBottom>
            🏠 {room.title}
          </Typography>
          <Typography color="primary" sx={{ mb: 1 }}>
            💰 {room.price?.toLocaleString()}₫ / tháng
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            📍 {room.address}
          </Typography>
          <Typography sx={{ mb: 2 }}>{room.description}</Typography>

          {room.owner_name && (
            <Typography color="text.secondary">
              👤 Người đăng: <b>{room.owner_name}</b>
            </Typography>
          )}
        </CardContent>

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate(-1)} // quay lại trang trước
        >
          ⬅ Quay lại
        </Button>
      </Card>
    </Container>
  );
}
