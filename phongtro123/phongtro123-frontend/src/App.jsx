import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import PostRoom from "./pages/PostRoom.jsx";
import RoomDetail from "./pages/RoomDetail.jsx";
import Navbar from "./components/Navbar.jsx"; // dùng Navbar mới

export default function App() {
  return (
    <Router>
      {/* ✅ Navbar riêng */}
      <Navbar />

      {/* ✅ Nội dung trang */}
      <Container sx={{ mt: 4, mb: 6 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post-room" element={<PostRoom />} /> {/* sửa path để khớp */}
          <Route path="/room/:id" element={<RoomDetail />} />
        </Routes>
      </Container>
    </Router>
  );
}
