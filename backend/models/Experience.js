const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: ["Project-Based", "Academic", "Internship", "Freelance", "Open Source"],
      default: "Project-Based",
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      default: "Present",
    },
    current: {
      type: Boolean,
      default: false,
    },
    highlights: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Experience", experienceSchema);
