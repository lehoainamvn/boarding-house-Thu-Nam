import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Hàm khởi tạo database
export async function initDB() {
  const db = await open({
    filename: './phongtro.db', // file SQLite nằm cùng thư mục backend
    driver: sqlite3.Database,
  });

  // Bảng người dùng
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);

  // Bảng phòng trọ
 await db.exec(`
  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    price INTEGER,
    address TEXT,
    description TEXT,
    image TEXT,
    user_id INTEGER
  );
`);
// =============== THÊM DỮ LIỆU MẪU ===============
const roomsCount = await db.get(`SELECT COUNT(*) as count FROM rooms;`);
if (roomsCount.count === 0) {
  await db.exec(`
   INSERT INTO rooms (title, price, address, description, image, user_id) VALUES
  ('Phòng trọ trung tâm Quận 1', 4500000, '45 Nguyễn Trãi, Quận 1, TP.HCM',
   'Phòng rộng 25m², có cửa sổ, WC riêng, gần chợ và trường học.',
   'https://sf-static.upanhlaylink.com/img/image_20251018842f84096c7b94e3657687c7c39d01a4.jpg', 1),
  ('Phòng trọ giá rẻ sinh viên Dĩ An', 1800000, '12/3 Nguyễn An Ninh, Dĩ An, Bình Dương',
   'Phòng 16m², có gác, wifi miễn phí, giờ giấc tự do.',
   'https://sf-static.upanhlaylink.com/img/image_20251018842f84096c7b94e3657687c7c39d01a4.jpg', 1),
  ('Phòng trọ cao cấp Bình Thạnh', 5200000, '88 Phan Văn Trị, Bình Thạnh, TP.HCM',
   'Phòng 30m², nội thất đầy đủ, có thang máy, bảo vệ 24/7.',
   'https://sf-static.upanhlaylink.com/img/image_20251018842f84096c7b94e3657687c7c39d01a4.jpg', 2),
  ('Phòng mini cho thuê Quận 7', 3700000, '234 Nguyễn Thị Thập, Quận 7, TP.HCM',
   'Phòng 20m², máy lạnh, giường, tủ, ban công thoáng mát.',
   'https://sf-static.upanhlaylink.com/img/image_20251018842f84096c7b94e3657687c7c39d01a4.jpg', 2),
  ('Phòng trọ gần Đại học Thủ Dầu Một', 1500000, 'Khu 3, phường Hiệp Thành, TP.Thủ Dầu Một',
   'Phòng mới xây, 18m², có chỗ để xe, wifi, điện nước riêng.',
   'https://sf-static.upanhlaylink.com/img/image_20251018842f84096c7b94e3657687c7c39d01a4.jpg', 1),
  ('Phòng trọ view hồ bơi Tân Bình', 4300000, '15 Trường Chinh, Tân Bình, TP.HCM',
   'Phòng 25m², có hồ bơi, gym, camera an ninh 24/24.',
   'https://sf-static.upanhlaylink.com/img/image_20251018842f84096c7b94e3657687c7c39d01a4.jpg', 3),
  ('Phòng trọ Quận 9 giá sinh viên', 1900000, '35 Lê Văn Việt, Quận 9, TP.Thủ Đức',
   'Phòng 18m², có gác, toilet riêng, gần Vincom và Đại học GTVT.',
   'https://sf-static.upanhlaylink.com/img/image_20251018842f84096c7b94e3657687c7c39d01a4.jpg', 1),
  ('Phòng cao cấp đầy đủ nội thất Gò Vấp', 4800000, '121 Lê Đức Thọ, Gò Vấp, TP.HCM',
   'Phòng 28m², full nội thất, thang máy, cửa vân tay.',
   'https://sf-static.upanhlaylink.com/img/image_20251018842f84096c7b94e3657687c7c39d01a4.jpg', 3),
  ('Phòng trọ khu an ninh Quận Tân Phú', 3200000, '78 Lũy Bán Bích, Tân Phú, TP.HCM',
   'Phòng 20m², khu dân cư yên tĩnh, có chỗ để xe, giờ giấc tự do.',
   'https://sf-static.upanhlaylink.com/img/image_20251018842f84096c7b94e3657687c7c39d01a4.jpg', 2),
  ('Phòng mini trung tâm Thủ Đức', 2500000, '54 Hoàng Diệu 2, Linh Trung, Thủ Đức, TP.HCM',
   'Phòng gác lửng, 18m², gần chợ và bến xe, có máy lạnh.',
   'https://sf-static.upanhlaylink.com/img/image_20251018842f84096c7b94e3657687c7c39d01a4.jpg', 2);

  `);
  console.log("✅ Đã thêm 10 phòng mẫu vào cơ sở dữ liệu.");
}



  console.log("✅ Database initialized: phongtro.db");
  return db;
}
