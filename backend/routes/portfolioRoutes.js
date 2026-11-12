const express = require("express");
const router = express.Router();
const {
  getPortfolioBundle,
  getAnalytics,
  skillsCrud,
  achievementsCrud,
  certificationsCrud,
  experienceCrud,
  educationCrud,
} = require("../controllers/portfolioController");
const { protect } = require("../middleware/authMiddleware");

// Public
router.get("/bundle", getPortfolioBundle);

// Admin analytics
router.get("/analytics", protect, getAnalytics);

// Skills
router.get("/skills", skillsCrud.getAll);
router.post("/skills", protect, skillsCrud.create);
router.put("/skills/:id", protect, skillsCrud.update);
router.delete("/skills/:id", protect, skillsCrud.delete);

// Achievements
router.get("/achievements", achievementsCrud.getAll);
router.post("/achievements", protect, achievementsCrud.create);
router.put("/achievements/:id", protect, achievementsCrud.update);
router.delete("/achievements/:id", protect, achievementsCrud.delete);

// Certifications
router.get("/certifications", certificationsCrud.getAll);
router.post("/certifications", protect, certificationsCrud.create);
router.put("/certifications/:id", protect, certificationsCrud.update);
router.delete("/certifications/:id", protect, certificationsCrud.delete);

// Experience
router.get("/experience", experienceCrud.getAll);
router.post("/experience", protect, experienceCrud.create);
router.put("/experience/:id", protect, experienceCrud.update);
router.delete("/experience/:id", protect, experienceCrud.delete);

// Education
router.get("/education", educationCrud.getAll);
router.post("/education", protect, educationCrud.create);
router.put("/education/:id", protect, educationCrud.update);
router.delete("/education/:id", protect, educationCrud.delete);

module.exports = router;
