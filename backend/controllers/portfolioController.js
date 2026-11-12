const {
  Project,
  Skill,
  Achievement,
  Certification,
  Experience,
  Education,
  ContactMessage,
  BlockchainVerification,
  readLocalDb,
  writeLocalDb,
  getMongoStatus,
} = require("../utils/memoryDb");
const crypto = require("crypto");

// @desc Get complete portfolio bundle for public UI
// @route GET /api/portfolio/bundle
// @access Public
const getPortfolioBundle = async (req, res) => {
  try {
    if (getMongoStatus()) {
      const [projects, skills, achievements, certifications, experience, education] =
        await Promise.all([
          Project.find().sort({ order: 1, createdAt: -1 }),
          Skill.find().sort({ order: 1 }),
          Achievement.find().sort({ order: 1 }),
          Certification.find().sort({ order: 1 }),
          Experience.find().sort({ order: 1 }),
          Education.find().sort({ order: 1 }),
        ]);

      return res.json({
        success: true,
        data: {
          profile: {
            name: "Jyotir Leha R",
            brandMark: "JL",
            title: "Full Stack Developer | Blockchain Enthusiast | Software Developer",
            bio: "I am Jyotir Leha R, a dedicated Computer Science Engineering student with deep interests in full-stack development, Ethereum smart contracts, cyber security, cloud infrastructure, and IoT. I build reliable, high-performance web applications and decentralized solutions.",
            location: "Thoothukudi, Tamil Nadu, India",
            college: "National Engineering College, Kovilpatti",
            degree: "Bachelor of Engineering (B.E) - Computer Science and Engineering",
            year: "3rd Year (Class of 2028)",
            email: "jyotirleha@gmail.com",
            github: "https://github.com/jyotirleha-ship-it",
            linkedin: "https://www.linkedin.com/in/jyotir-leha-r-7971a232a/",
            resumeUrl: "/assets/resume.pdf",
            avatarUrl: "/assets/profile.jpeg",
          },
          projects,
          skills,
          achievements,
          certifications,
          experience,
          education,
        },
      });
    } else {
      const local = readLocalDb();
      return res.json({
        success: true,
        data: {
          profile: {
            name: "Jyotir Leha R",
            brandMark: "JL",
            title: "Full Stack Developer | Blockchain Enthusiast | Software Developer",
            bio: "I am Jyotir Leha R, a dedicated Computer Science Engineering student with deep interests in full-stack development, Ethereum smart contracts, cyber security, cloud infrastructure, and IoT. I build reliable, high-performance web applications and decentralized solutions.",
            location: "Thoothukudi, Tamil Nadu, India",
            college: "National Engineering College, Kovilpatti",
            degree: "Bachelor of Engineering (B.E) - Computer Science and Engineering",
            year: "3rd Year (Class of 2028)",
            email: "jyotirleha@gmail.com",
            github: "https://github.com/jyotirleha-ship-it",
            linkedin: "https://www.linkedin.com/in/jyotir-leha-r-7971a232a/",
            resumeUrl: "/assets/resume.pdf",
            avatarUrl: "/assets/profile.jpeg",
          },
          projects: local.projects || [],
          skills: local.skills || [],
          achievements: local.achievements || [],
          certifications: local.certifications || [],
          experience: local.experiences || [],
          education: local.educations || [],
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get analytics for admin dashboard
// @route GET /api/portfolio/analytics
// @access Private (Admin)
const getAnalytics = async (req, res) => {
  try {
    if (getMongoStatus()) {
      const [
        totalProjects,
        verifiedProjects,
        totalSkills,
        totalCertifications,
        totalAchievements,
        unreadMessages,
        totalMessages,
      ] = await Promise.all([
        Project.countDocuments(),
        Project.countDocuments({ onChainRegistered: true }),
        Skill.countDocuments(),
        Certification.countDocuments(),
        Achievement.countDocuments(),
        ContactMessage.countDocuments({ read: false }),
        ContactMessage.countDocuments(),
      ]);

      return res.json({
        success: true,
        data: {
          totalProjects,
          verifiedProjects,
          totalSkills,
          totalCertifications,
          totalAchievements,
          unreadMessages,
          totalMessages,
          dbMode: "MongoDB Atlas",
        },
      });
    } else {
      const local = readLocalDb();
      const projects = local.projects || [];
      const messages = local.contactMessages || [];

      return res.json({
        success: true,
        data: {
          totalProjects: projects.length,
          verifiedProjects: projects.filter((p) => p.onChainRegistered).length,
          totalSkills: (local.skills || []).length,
          totalCertifications: (local.certifications || []).length,
          totalAchievements: (local.achievements || []).length,
          unreadMessages: messages.filter((m) => !m.read).length,
          totalMessages: messages.length,
          dbMode: "Local Persistent JSON",
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Generic CRUD helper for items (skills, achievements, certifications, experience, education)
const createCrudHandlers = (modelName, collectionKey) => {
  return {
    getAll: async (req, res) => {
      try {
        if (getMongoStatus()) {
          const Model = require(`../models/${modelName}`);
          const items = await Model.find().sort({ order: 1 });
          return res.json({ success: true, data: items });
        } else {
          const local = readLocalDb();
          return res.json({ success: true, data: local[collectionKey] || [] });
        }
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },
    create: async (req, res) => {
      try {
        if (getMongoStatus()) {
          const Model = require(`../models/${modelName}`);
          const item = await Model.create(req.body);
          return res.status(201).json({ success: true, data: item });
        } else {
          const local = readLocalDb();
          if (!local[collectionKey]) local[collectionKey] = [];
          const id = "item_" + crypto.randomBytes(4).toString("hex");
          const item = { _id: id, id, ...req.body, createdAt: new Date().toISOString() };
          local[collectionKey].push(item);
          writeLocalDb(local);
          return res.status(201).json({ success: true, data: item });
        }
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },
    update: async (req, res) => {
      try {
        const { id } = req.params;
        if (getMongoStatus()) {
          const Model = require(`../models/${modelName}`);
          const item = await Model.findByIdAndUpdate(id, req.body, { new: true });
          if (!item) return res.status(404).json({ success: false, message: "Item not found" });
          return res.json({ success: true, data: item });
        } else {
          const local = readLocalDb();
          const list = local[collectionKey] || [];
          const idx = list.findIndex((x) => (x.id || x._id) === id);
          if (idx === -1) return res.status(404).json({ success: false, message: "Item not found" });
          list[idx] = { ...list[idx], ...req.body, updatedAt: new Date().toISOString() };
          writeLocalDb(local);
          return res.json({ success: true, data: list[idx] });
        }
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },
    delete: async (req, res) => {
      try {
        const { id } = req.params;
        if (getMongoStatus()) {
          const Model = require(`../models/${modelName}`);
          const item = await Model.findByIdAndDelete(id);
          if (!item) return res.status(404).json({ success: false, message: "Item not found" });
          return res.json({ success: true, message: "Deleted successfully" });
        } else {
          const local = readLocalDb();
          const list = local[collectionKey] || [];
          const filtered = list.filter((x) => (x.id || x._id) !== id);
          if (filtered.length === list.length) {
            return res.status(404).json({ success: false, message: "Item not found" });
          }
          local[collectionKey] = filtered;
          writeLocalDb(local);
          return res.json({ success: true, message: "Deleted successfully" });
        }
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },
  };
};

module.exports = {
  getPortfolioBundle,
  getAnalytics,
  skillsCrud: createCrudHandlers("Skill", "skills"),
  achievementsCrud: createCrudHandlers("Achievement", "achievements"),
  certificationsCrud: createCrudHandlers("Certification", "certifications"),
  experienceCrud: createCrudHandlers("Experience", "experiences"),
  educationCrud: createCrudHandlers("Education", "educations"),
};
