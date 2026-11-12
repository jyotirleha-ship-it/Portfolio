const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Languages", "Frontend", "Backend", "Database", "Blockchain & Web3", "Tools & DevOps", "Domains & Security"],
      default: "Languages",
    },
    proficiency: {
      type: Number,
      min: 1,
      max: 100,
      default: 80,
    },
    summary: {
      type: String,
      default: "",
    },
    detail: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "code",
    },
    featured: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Skill", skillSchema);
