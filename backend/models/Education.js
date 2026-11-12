const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    field: {
      type: String,
      required: true,
      trim: true,
    },
    institution: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: "",
    },
    startYear: {
      type: String,
      required: true,
    },
    endYear: {
      type: String,
      required: true,
    },
    score: {
      type: String,
      default: "",
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

module.exports = mongoose.model("Education", educationSchema);
