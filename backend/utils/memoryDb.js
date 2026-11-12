const fs = require("fs");
const path = require("path");
const { getMongoStatus } = require("../config/db");

// Models
const Admin = require("../models/Admin");
const Project = require("../models/Project");
const Skill = require("../models/Skill");
const Achievement = require("../models/Achievement");
const Certification = require("../models/Certification");
const Experience = require("../models/Experience");
const Education = require("../models/Education");
const ContactMessage = require("../models/ContactMessage");
const ChatbotKnowledge = require("../models/ChatbotKnowledge");
const BlockchainVerification = require("../models/BlockchainVerification");

const DB_FILE = path.join(__dirname, "../data/local_db.json");

function ensureDbFile() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initial = {
      admins: [],
      projects: [],
      skills: [],
      achievements: [],
      certifications: [],
      experiences: [],
      educations: [],
      contactMessages: [],
      chatbotKnowledge: [],
      blockchainVerifications: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
  }
}

function readLocalDb() {
  ensureDbFile();
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    return {};
  }
}

function writeLocalDb(data) {
  ensureDbFile();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  Admin,
  Project,
  Skill,
  Achievement,
  Certification,
  Experience,
  Education,
  ContactMessage,
  ChatbotKnowledge,
  BlockchainVerification,
  readLocalDb,
  writeLocalDb,
  getMongoStatus,
};
