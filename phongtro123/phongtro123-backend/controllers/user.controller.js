import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const SECRET_KEY = "PHONGTRO123_SECRET";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const db = req.db;
    const userModel = new User(db);

    const existing = await userModel.findByEmail(email);
    if (existing) return res.status(400).json({ message: "Email đã tồn tại!" });

    const hashed = await bcrypt.hash(password, 10);
    await userModel.create(name, email, hashed);

    res.json({ message: "Đăng ký thành công!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = req.db;
    const userModel = new User(db);
    const user = await userModel.findByEmail(email);

    if (!user) return res.status(404).json({ message: "Không tìm thấy tài khoản!" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Sai mật khẩu!" });

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1d" });
    res.json({ message: "Đăng nhập thành công!", token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
