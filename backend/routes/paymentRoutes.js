const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getPurchasedNotes,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);
router.get("/purchased", protect, getPurchasedNotes);

module.exports = router;