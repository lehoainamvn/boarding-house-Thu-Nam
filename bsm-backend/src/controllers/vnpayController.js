import {
  generatePaymentUrlService,
  processVnpayIPNService,
  processVnpayReturnService
} from "../services/vnpay.service.js";
import sql, { poolPromise } from "../config/db.js";
import { createNotification } from "../services/notification.service.js";

export const createPaymentUrl = async (req, res) => {
  try {
    const { amount, invoiceId } = req.body;
    const ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    
    const finalUrl = await generatePaymentUrlService(amount, invoiceId, ipAddr);

    return res.json({ paymentUrl: finalUrl });
  } catch (error) {
    console.error("Lỗi tạo link thanh toán:", error);
    return res.status(500).json({ message: "Lỗi tạo link thanh toán" });
  }
};

export const vnpayIPN = async (req, res) => {
  try {
    const result = await processVnpayIPNService(req.query);
    return res.status(200).json(result);
  } catch (error) {
    console.error("LỖI IPN:", error);
    return res.status(500).json({ RspCode: "99", Message: "System error" });
  }
};

export const vnpayReturn = async (req, res) => {
  try {
    const result = await processVnpayReturnService(req.query);
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("LỖI VNPAY RETURN:", error); 
    return res.status(500).json({ success: false, message: "Lỗi hệ thống khi kiểm tra giao dịch" });
  }
};

export const confirmBankTransfer = async (req, res) => {
  try {
    const tenantId = req.user.id;
    const { invoiceId } = req.body;

    if (!invoiceId) {
      return res.status(400).json({ message: "Thiếu thông tin hóa đơn" });
    }

    const pool = await poolPromise;

    // 1. Kiểm tra hóa đơn tồn tại và thuộc về tenant này
    const invoiceRes = await pool.request()
      .input("invoiceId", sql.Int, invoiceId)
      .input("tenantId", sql.Int, tenantId)
      .query(`
        SELECT i.*, r.room_name, r.owner_id, u.name AS tenant_name
        FROM invoices i
        JOIN rooms r ON i.room_id = r.id
        JOIN users u ON i.tenant_id = u.id
        WHERE i.id = @invoiceId AND i.tenant_id = @tenantId
      `);

    if (invoiceRes.recordset.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn hoặc bạn không có quyền truy cập" });
    }

    const invoice = invoiceRes.recordset[0];

    if (invoice.status === "PAID") {
      return res.status(400).json({ message: "Hóa đơn đã được thanh toán trước đó" });
    }

    // 2. Tiến hành cập nhật trạng thái hóa đơn và tạo bản ghi lịch sử thanh toán
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      // Cập nhật trạng thái hóa đơn thành PAID
      const updateRequest = new sql.Request(transaction);
      await updateRequest
        .input("invoiceId", sql.Int, invoiceId)
        .query("UPDATE invoices SET status = 'PAID', paid_at = CURRENT_TIMESTAMP WHERE id = @invoiceId");

      // Thêm bản ghi vào bảng payments
      const paymentRequest = new sql.Request(transaction);
      await paymentRequest
        .input("invoiceId", sql.Int, invoiceId)
        .input("amount", sql.Decimal(12, 2), invoice.total_amount)
        .query(`
          INSERT INTO payments (invoice_id, amount, method, paid_at, vnp_ResponseCode) 
          VALUES (@invoiceId, @amount, 'BANK_TRANSFER', CURRENT_TIMESTAMP, '00')
        `);

      await transaction.commit();
    } catch (dbError) {
      await transaction.rollback();
      throw dbError;
    }

    // 3. Tạo thông báo gửi cho chủ nhà (owner_id)
    try {
      const formattedMoney = new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
      }).format(invoice.total_amount);

      await createNotification({
        user_id: invoice.owner_id,
        title: "Xác nhận chuyển khoản",
        content: `Người thuê ${invoice.tenant_name} đã xác nhận chuyển khoản ${formattedMoney} cho hóa đơn tháng ${invoice.month} phòng ${invoice.room_name}. Vui lòng đối soát tài khoản.`
      });
    } catch (notifyError) {
      console.error("Lỗi tạo thông báo chuyển khoản ngân hàng:", notifyError);
    }

    return res.json({ success: true, message: "Xác nhận chuyển khoản thành công" });
  } catch (error) {
    console.error("Lỗi xác nhận chuyển khoản ngân hàng:", error);
    return res.status(500).json({ message: "Lỗi hệ thống khi xác nhận chuyển khoản" });
  }
};