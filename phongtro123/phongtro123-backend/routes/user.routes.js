import express from "express";
import { register, login } from "../controllers/user.controller.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// 🧩 Cập nhật thông tin người dùng
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const sql =
      "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";
    await req.db.run(sql, [name, email, password, id]);

    res.json({ message: "Cập nhật thông tin thành công!" });
  } catch (err) {
    console.error("❌ Lỗi cập nhật user:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
