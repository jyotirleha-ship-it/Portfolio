const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    tagline: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Full Stack", "Blockchain", "Web Development", "Java", "DevOps", "IoT", "Cybersecurity"],
      default: "Full Stack",
    },
    technologies: {
      type: [String],
      required: true,
      default: [],
    },
    imageUrl: {
      type: String,
      default: "",
    },
    githubUrl: {
      type: String,
      default: "",
    },
    liveUrl: {
      type: String,
      default: "",
    },
    version: {
      type: String,
      default: "1.0.0",
    },
    status: {
      type: String,
      enum: ["Completed", "In Progress", "Verified", "Archived"],
      default: "Completed",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    contentHash: {
      type: String, // Canonical SHA-256 hash
      default: "",
    },
    onChainRegistered: {
      type: Boolean,
      default: false,
    },
    txHash: {
      type: String,
      default: "",
    },
    contractAddress: {
      type: String,
      default: "",
    },
    blockchainNetwork: {
      type: String,
      default: "Ethereum Sepolia",
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
