const express = require("express");
const router = express.Router();
const {
  verifyProjectOnChain,
  registerProjectOnChain,
  getVerificationHistory,
} = require("../controllers/blockchainController");
const { protect } = require("../middleware/authMiddleware");

// Public
router.post("/verify", verifyProjectOnChain);
router.get("/history", getVerificationHistory);

// Admin
router.post("/register", protect, registerProjectOnChain);

module.exports = router;
