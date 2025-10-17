export class User {
  constructor(db) {
    this.db = db;
  }

  async create(name, email, password) {
    const result = await this.db.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );
    return result.lastID;
  }

  async findByEmail(email) {
    return await this.db.get("SELECT * FROM users WHERE email = ?", [email]);
  }

  async findById(id) {
    return await this.db.get("SELECT * FROM users WHERE id = ?", [id]);
  }
}
