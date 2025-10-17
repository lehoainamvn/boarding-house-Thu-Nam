import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

export default function RoomCard({ room }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardMedia
        component="img"
        height="180"
        image={room.image || "https://via.placeholder.com/400x200"}
        alt={room.title}
      />
      <CardContent>
        <Typography variant="h6">{room.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          📍 {room.address}
        </Typography>
        <Typography variant="body1" sx={{ color: "green" }}>
          💰 {room.price.toLocaleString()} VNĐ/tháng
        </Typography>
      </CardContent>
    </Card>
  );
}
