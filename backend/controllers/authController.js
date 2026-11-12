const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Admin, readLocalDb, writeLocalDb, getMongoStatus } = require("../utils/memoryDb");

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "digital_universe_super_secret_jwt_key_2026",
    { expiresIn: "7d" }
  );
};

// @desc Auth admin & get token
// @route POST /api/auth/login
// @access Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    let admin = null;
    let isMatch = false;

    if (getMongoStatus()) {
      admin = await Admin.findOne({ email: email.toLowerCase() });
      if (admin) {
        isMatch = await admin.matchPassword(password);
      }
    } else {
      const local = readLocalDb();
      admin = (local.admins || []).find((a) => a.email.toLowerCase() === email.toLowerCase());
      if (admin) {
        isMatch = await bcrypt.compare(password, admin.passwordHash);
      }
    }

    if (!admin || !isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Update lastLogin
    const adminId = admin._id || admin.id;
    if (getMongoStatus()) {
      admin.lastLogin = new Date();
      await admin.save();
    } else {
      const local = readLocalDb();
      const idx = local.admins.findIndex((a) => (a.id || a._id) === adminId);
      if (idx !== -1) {
        local.admins[idx].lastLogin = new Date().toISOString();
        writeLocalDb(local);
      }
    }

    res.json({
      success: true,
      data: {
        id: adminId,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        token: generateToken(adminId),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get current admin profile
// @route GET /api/auth/me
// @access Private (Admin)
const getAdminProfile = async (req, res) => {
  res.json({
    success: true,
    data: req.admin,
  });
};

module.exports = {
  loginAdmin,
  getAdminProfile,
};
