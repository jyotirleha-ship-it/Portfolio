const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const path = require("path");

// Load environment variables
dotenv.config();

const { connectDB } = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const contactRoutes = require("./routes/contactRoutes");
const chatRoutes = require("./routes/chatRoutes");
const blockchainRoutes = require("./routes/blockchainRoutes");

const app = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".onrender.com") ||
        origin.includes("github.io")
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for portfolio showcase
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per window
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

// Specific stricter limiter for contact form & chat
const submissionLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: "Rate limit exceeded. Please wait a few moments before trying again.",
  },
});

app.use("/api/contact", submissionLimiter);
app.use("/api/chat", submissionLimiter);

// Static assets route for certificates, resume, and profile photos
const assetsPath = path.join(__dirname, "../frontend/public/assets");
app.use("/assets", express.static(assetsPath));

// API health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    system: "The Digital Universe — Jyotir Leha Portfolio API",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/blockchain", blockchainRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5000;

function startServer(portToTry) {
  const server = app.listen(portToTry, () => {
    console.log("=================================================");
    console.log(`🌌 THE DIGITAL UNIVERSE API SERVER ONLINE`);
    console.log(`📡 URL: http://localhost:${portToTry}`);
    console.log(`🛡️  Mode: ${process.env.NODE_ENV || "development"}`);
    console.log("=================================================");
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`Port ${portToTry} in use, attempting ${portToTry + 1}...`);
      startServer(portToTry + 1);
    } else {
      console.error("Server listen error:", err);
    }
  });
}

// Start server only when run directly
if (require.main === module) {
  connectDB().then(() => {
    startServer(DEFAULT_PORT);
  });
}

module.exports = app;
