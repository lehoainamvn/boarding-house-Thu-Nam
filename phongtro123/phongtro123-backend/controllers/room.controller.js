import { Room } from "../models/room.model.js";

export const getRooms = async (req, res) => {
  const db = req.db;
  const roomModel = new Room(db);
  const rooms = await roomModel.findAll();
  res.json(rooms);
};

export const createRoom = async (req, res) => {
  try {
    const db = req.db;
    const roomModel = new Room(db);
    const { title, price, address, description, image, user_id } = req.body;

    const id = await roomModel.create({ title, price, address, description, image, user_id });
    res.json({ message: "Đăng tin thành công!", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
