import express from "express";
const router = express.Router();

/**
 * 🏠 Lấy toàn bộ danh sách phòng
 */
router.get("/", async (req, res) => {
  try {
    const rooms = await req.db.all("SELECT * FROM rooms ORDER BY id DESC");
    res.json(rooms);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách phòng:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * 👤 Lấy danh sách phòng theo user_id
 */
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("📥 Truy vấn phòng của user:", userId);

    const rooms = await req.db.all(
      "SELECT * FROM rooms WHERE user_id = ? ORDER BY id DESC",
      [userId]
    );

    console.log("📤 Kết quả:", rooms);
    res.json(rooms);
  } catch (err) {
    console.error("❌ Lỗi lấy phòng user:", err.message);
    res.status(500).json({ error: err.message });
  }
});
// ✅ API: lấy chi tiết phòng theo id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const room = await req.db.get(
      `SELECT rooms.*, users.name AS owner_name 
       FROM rooms 
       LEFT JOIN users ON rooms.user_id = users.id 
       WHERE rooms.id = ?`,
      [id]
    );

    if (!room) return res.status(404).json({ error: "Không tìm thấy phòng" });
    res.json(room);
  } catch (err) {
    console.error("❌ Lỗi lấy chi tiết phòng:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * 📝 Đăng tin phòng mới
 */
router.post("/", async (req, res) => {
  try {
    const { title, price, address, description, image, user_id } = req.body;
    console.log("📥 Dữ liệu nhận được:", req.body);

    if (!title || !price || !address || !user_id) {
      return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
    }

    const result = await req.db.run(
      "INSERT INTO rooms (title, price, address, description, image, user_id) VALUES (?, ?, ?, ?, ?, ?)",
      [title, price, address, description, image, user_id]
    );

    console.log("✅ Thêm phòng thành công, ID:", result.lastID);
    res.json({
      message: "Đăng phòng thành công",
      id: result.lastID,
    });
  } catch (err) {
    console.error("❌ Lỗi khi đăng phòng:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
