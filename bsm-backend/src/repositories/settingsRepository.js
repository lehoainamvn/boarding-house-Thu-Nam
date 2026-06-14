import sql from "../config/db.js";
import { poolPromise } from "../config/db.js";


// Lấy cài đặt (Cập nhật query để lấy thêm default_room_price và default_service_fee)
export async function getSettingsByOwner(ownerId) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input("owner_id", sql.Int, ownerId)
    .query(`SELECT billing_day, default_electric_price, default_water_price, default_room_price, default_service_fee, bank_name, bank_account, bank_owner, qr_image_url 
            FROM settings WHERE owner_id = @owner_id`);
  return result.recordset[0];
}

// Cập nhật cài đặt
export async function updateSettingsRepo(ownerId, data) {
  const pool = await poolPromise;
  
  // 1. Kiểm tra xem cấu hình của owner này đã tồn tại chưa
  const checkRes = await pool.request()
    .input("owner_id", sql.Int, ownerId)
    .query(`SELECT 1 FROM settings WHERE owner_id = @owner_id`);

  if (checkRes.recordset.length === 0) {
    // Nếu chưa tồn tại, thực hiện INSERT
    await pool.request()
      .input("owner_id", sql.Int, ownerId)
      .input("billing_day", sql.Int, data.billing_day || 5)
      .input("electric_price", sql.Decimal(12,2), data.default_electric_price || 0)
      .input("water_price", sql.Decimal(12,2), data.default_water_price || 0)
      .input("room_price", sql.Decimal(12,2), data.default_room_price || 0)
      .input("service_fee", sql.Decimal(12,2), data.default_service_fee || 0)
      .input("bank_name", sql.NVarChar(100), data.bank_name || "")
      .input("bank_account", sql.NVarChar(50), data.bank_account || "")
      .input("bank_owner", sql.NVarChar(150), data.bank_owner || "")
      .input("qr_image_url", sql.NVarChar(500), data.qr_image_url || "")
      .query(`
        INSERT INTO settings (owner_id, billing_day, default_electric_price, default_water_price, default_room_price, default_service_fee, bank_name, bank_account, bank_owner, qr_image_url)
        VALUES (@owner_id, @billing_day, @electric_price, @water_price, @room_price, @service_fee, @bank_name, @bank_account, @bank_owner, @qr_image_url)
      `);
  } else {
    // Nếu đã tồn tại, thực hiện UPDATE
    await pool.request()
      .input("owner_id", sql.Int, ownerId)
      .input("billing_day", sql.Int, data.billing_day)
      .input("electric_price", sql.Decimal(12,2), data.default_electric_price)
      .input("water_price", sql.Decimal(12,2), data.default_water_price)
      .input("room_price", sql.Decimal(12,2), data.default_room_price) // Thêm giá phòng
      .input("service_fee", sql.Decimal(12,2), data.default_service_fee) // Thêm chi phí phát sinh mặc định
      .input("bank_name", sql.NVarChar(100), data.bank_name || "")
      .input("bank_account", sql.NVarChar(50), data.bank_account || "")
      .input("bank_owner", sql.NVarChar(150), data.bank_owner || "")
      .input("qr_image_url", sql.NVarChar(500), data.qr_image_url || "")
      .query(`
        UPDATE settings
        SET billing_day = @billing_day,
            default_electric_price = @electric_price,
            default_water_price = @water_price,
            default_room_price = @room_price,
            default_service_fee = @service_fee,
            bank_name = @bank_name,
            bank_account = @bank_account,
            bank_owner = @bank_owner,
            qr_image_url = @qr_image_url
        WHERE owner_id = @owner_id
      `);
  }

  // 2. Nếu chọn "Áp dụng cho phòng"
  if (data.apply_to_all) {
    const request = pool.request()
      .input("owner_id", sql.Int, ownerId)
      .input("room_price", sql.Decimal(12,2), data.default_room_price)
      .input("electric_price", sql.Decimal(12,2), data.default_electric_price)
      .input("water_price", sql.Decimal(12,2), data.default_water_price);

    // Nếu có chọn nhà trọ cụ thể
    if (data.selected_house_id) {
      request.input("house_id", sql.Int, data.selected_house_id);
      await request.query(`
        UPDATE rooms 
        SET room_price = @room_price, 
            electric_price = @electric_price, 
            water_price = @water_price 
        WHERE owner_id = @owner_id AND house_id = @house_id
      `);
    } else {
      // Cập nhật tất cả phòng
      await request.query(`
        UPDATE rooms 
        SET room_price = @room_price, 
            electric_price = @electric_price, 
            water_price = @water_price 
        WHERE owner_id = @owner_id
      `);
    }
  }
}