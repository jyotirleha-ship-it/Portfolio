const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

let isMongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn("MONGODB_URI is not set in .env. Operating with local file-backed DB fallback.");
    isMongoConnected = false;
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    isMongoConnected = true;
    return true;
  } catch (error) {
    console.warn(`MongoDB Atlas connection error: ${error.message}`);
    console.warn("Falling back to local persistent store for uninterrupted operation.");
    isMongoConnected = false;
    return false;
  }
};

const getMongoStatus = () => isMongoConnected;

module.exports = {
  connectDB,
  getMongoStatus,
};
