import express from "express";
import * as paymentController from "../controllers/vnpayController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

// Client gọi cái này để lấy link đi VNPAY
router.post("/create-url", paymentController.createPaymentUrl);

// VNPAY gọi cái này để thông báo kết quả (IPN)
router.get("/vnpay-ipn", paymentController.vnpayIPN);
router.get("/vnpay-return", paymentController.vnpayReturn); 

// Xác nhận chuyển khoản ngân hàng trực tiếp qua QR
router.post("/confirm-bank-transfer", authMiddleware, paymentController.confirmBankTransfer);

export default router;