const mongoose = require("mongoose");

const blockchainVerificationSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      trim: true,
    },
    projectTitle: {
      type: String,
      default: "",
    },
    version: {
      type: String,
      default: "1.0.0",
    },
    contentHash: {
      type: String,
      required: true,
    },
    txHash: {
      type: String,
      default: "",
    },
    blockNumber: {
      type: Number,
      default: 0,
    },
    network: {
      type: String,
      default: "Ethereum Sepolia",
    },
    contractAddress: {
      type: String,
      default: "",
    },
    verifiedBy: {
      type: String,
      default: "System Admin",
    },
    status: {
      type: String,
      enum: ["Confirmed", "Pending", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlockchainVerification", blockchainVerificationSchema);
