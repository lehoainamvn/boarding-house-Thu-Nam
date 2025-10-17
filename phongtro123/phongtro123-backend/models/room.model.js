export class Room {
  constructor(db) {
    this.db = db;
  }

  async create({ title, price, address, description, image, user_id }) {
    const result = await this.db.run(
      "INSERT INTO rooms (title, price, address, description, image, user_id) VALUES (?, ?, ?, ?, ?, ?)",
      [title, price, address, description, image, user_id]
    );
    return result.lastID;
  }

  async findAll() {
    return await this.db.all("SELECT * FROM rooms ORDER BY id DESC");
  }

  async findByUser(user_id) {
    return await this.db.all("SELECT * FROM rooms WHERE user_id = ?", [user_id]);
  }

  async findById(id) {
    return await this.db.get("SELECT * FROM rooms WHERE id = ?", [id]);
  }
}
