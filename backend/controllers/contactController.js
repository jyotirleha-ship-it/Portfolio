const { ContactMessage, readLocalDb, writeLocalDb, getMongoStatus } = require("../utils/memoryDb");
const crypto = require("crypto");

// @desc Submit contact message (public)
// @route POST /api/contact
// @access Public
const submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message, website } = req.body;

    // Spam honeypot trap: bots usually fill hidden 'website' input
    if (website && website.trim().length > 0) {
      return res.status(200).json({ success: true, message: "Message received" });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Please provide name, email, and message" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address" });
    }

    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";

    const messageData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: (subject || "Portfolio Inquiry").trim(),
      message: message.trim(),
      read: false,
      responded: false,
      ipAddress,
    };

    if (getMongoStatus()) {
      const created = await ContactMessage.create(messageData);
      return res.status(201).json({
        success: true,
        message: "Your message has been transmitted across the digital universe! Jyotir will get back to you shortly.",
        data: { id: created._id },
      });
    } else {
      const local = readLocalDb();
      if (!local.contactMessages) local.contactMessages = [];
      const id = "msg_" + crypto.randomBytes(4).toString("hex");
      const record = { _id: id, id, ...messageData, createdAt: new Date().toISOString() };
      local.contactMessages.unshift(record);
      writeLocalDb(local);
      return res.status(201).json({
        success: true,
        message: "Your message has been transmitted across the digital universe! Jyotir will get back to you shortly.",
        data: { id },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all contact messages (admin)
// @route GET /api/contact
// @access Private (Admin)
const getContactMessages = async (req, res) => {
  try {
    if (getMongoStatus()) {
      const messages = await ContactMessage.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: messages.length, data: messages });
    } else {
      const local = readLocalDb();
      return res.json({
        success: true,
        count: (local.contactMessages || []).length,
        data: local.contactMessages || [],
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Mark message as read
// @route PATCH /api/contact/:id/read
// @access Private (Admin)
const markMessageAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    if (getMongoStatus()) {
      const msg = await ContactMessage.findByIdAndUpdate(id, { read: true }, { new: true });
      if (!msg) return res.status(404).json({ success: false, message: "Message not found" });
      return res.json({ success: true, data: msg });
    } else {
      const local = readLocalDb();
      const list = local.contactMessages || [];
      const item = list.find((m) => (m.id || m._id) === id);
      if (!item) return res.status(404).json({ success: false, message: "Message not found" });
      item.read = true;
      writeLocalDb(local);
      return res.json({ success: true, data: item });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete contact message
// @route DELETE /api/contact/:id
// @access Private (Admin)
const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    if (getMongoStatus()) {
      const msg = await ContactMessage.findByIdAndDelete(id);
      if (!msg) return res.status(404).json({ success: false, message: "Message not found" });
      return res.json({ success: true, message: "Message deleted" });
    } else {
      const local = readLocalDb();
      const list = local.contactMessages || [];
      local.contactMessages = list.filter((m) => (m.id || m._id) !== id);
      writeLocalDb(local);
      return res.json({ success: true, message: "Message deleted" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitContactMessage,
  getContactMessages,
  markMessageAsRead,
  deleteContactMessage,
};
