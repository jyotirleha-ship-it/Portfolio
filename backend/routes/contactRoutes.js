const express = require("express");
const router = express.Router();
const {
  submitContactMessage,
  getContactMessages,
  markMessageAsRead,
  deleteContactMessage,
} = require("../controllers/contactController");
const { protect } = require("../middleware/authMiddleware");

// Public
router.post("/", submitContactMessage);

// Admin
router.get("/", protect, getContactMessages);
router.patch("/:id/read", protect, markMessageAsRead);
router.delete("/:id", protect, deleteContactMessage);

module.exports = router;
