require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const reportRoutes = require("./routes/reports");
const db = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Test database connection on startup
(async () => {
  try {
    const conn = await db.pool.getConnection();
    console.log("Database connected successfully");
    conn.release();
  } catch (err) {
    console.error("Database connection failed:", err.message);
    console.error(
      "Make sure MySQL is running with correct credentials in .env file",
    );
  }
})();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res
    .status(404)
    .json({ message: `Route ${req.method} ${req.path} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File size exceeds 10MB limit" });
  }

  if (err.message && err.message.includes("Only PDF")) {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({ message: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Uploads directory: ${path.join(__dirname, "uploads")}`);
});
