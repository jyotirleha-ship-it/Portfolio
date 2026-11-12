const jwt = require("jsonwebtoken");
const { Admin, readLocalDb, getMongoStatus } = require("../utils/memoryDb");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "digital_universe_super_secret_jwt_key_2026"
      );

      if (getMongoStatus()) {
        req.admin = await Admin.findById(decoded.id).select("-passwordHash");
      } else {
        const local = readLocalDb();
        req.admin = (local.admins || []).find((a) => a.id === decoded.id || a._id === decoded.id);
        if (req.admin) {
          const { passwordHash, ...safe } = req.admin;
          req.admin = safe;
        }
      }

      if (!req.admin) {
        return res.status(401).json({ success: false, message: "Admin authorization failed" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
  } else {
    return res.status(401).json({ success: false, message: "Authorization token required" });
  }
};

module.exports = { protect };
