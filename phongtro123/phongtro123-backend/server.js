import express from "express";
import cors from "cors";
import { initDB } from "./db.js";
import userRoutes from "./routes/user.routes.js";
import roomRoutes from "./routes/room.routes.js";

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "http://3.80.45.151:5173"],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"]
}));

// Kết nối database cho mỗi request
app.use(async (req, res, next) => {
  try {
    req.db = await initDB();
    next();
  } catch (err) {
    console.error("❌ Lỗi kết nối database:", err);
    res.status(500).send("Database connection failed");
  }
});

app.use("/api", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/users", userRoutes);

app.listen(3000, () => {
  console.log("✅ PhongTro123 backend đang chạy tại port 3000");
});
