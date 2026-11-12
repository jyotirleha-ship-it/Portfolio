const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    issuer: {
      type: String,
      required: true,
      trim: true,
    },
    issueDate: {
      type: String,
      default: "",
    },
    credentialId: {
      type: String,
      default: "",
    },
    credentialUrl: {
      type: String,
      default: "",
    },
    file: {
      type: String, // PDF relative or direct path
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ["Cybersecurity", "Blockchain", "Cloud", "IoT", "Programming", "Academic"],
      default: "Academic",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certification", certificationSchema);
