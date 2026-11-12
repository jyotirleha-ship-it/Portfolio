const express = require("express");
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");

// Public
router.get("/", getProjects);
router.get("/:projectId", getProjectById);

// Protected Admin
router.post("/", protect, createProject);
router.put("/:projectId", protect, updateProject);
router.delete("/:projectId", protect, deleteProject);

module.exports = router;
