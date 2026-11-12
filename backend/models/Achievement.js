const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    event: {
      type: String,
      required: true,
      trim: true,
    },
    issuer: {
      type: String,
      default: "",
    },
    date: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    badge: {
      type: String,
      default: "Contest",
    },
    highlight: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Achievement", achievementSchema);
