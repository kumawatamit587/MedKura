const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  getAllReports,
  getReportById,
  createReport,
  updateStatus,
} = require("../controllers/reportController");

// all report routes require a valid JWT
router.use(authMiddleware);

// GET  /api/reports
router.get("/", getAllReports);

// GET  /api/reports/:id
router.get("/:id", getReportById);

// POST /api/reports  (multipart form with file)
router.post("/", upload.single("file"), createReport);

// PATCH /api/reports/:id/status
router.patch("/:id/status", updateStatus);

module.exports = router;
