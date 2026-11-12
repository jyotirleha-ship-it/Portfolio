const mongoose = require("mongoose");

const chatbotKnowledgeSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["bio", "skills", "projects", "education", "experience", "certificates", "contact", "blockchain", "general"],
      default: "general",
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    questionKeywords: {
      type: [String],
      default: [],
    },
    content: {
      type: String,
      required: true,
    },
    importance: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatbotKnowledge", chatbotKnowledgeSchema);
