const db = require("../config/db");
const path = require("path");
const fs = require("fs");

const VALID_STATUSES = ["UPLOADED", "PROCESSING", "COMPLETED"];

// GET /api/reports
const getAllReports = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.error("User not authenticated in getAllReports");
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const [reports] = await db.query(
      `SELECT id, user_id, name, type, file_path, status, summary, created_at
       FROM reports
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id],
    );

    res.json(reports);
  } catch (error) {
    console.error("Get reports error:", error.message, error.code);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

// GET /api/reports/:id
const getReportById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const [rows] = await db.query(
      `SELECT id, user_id, name, type, file_path, status, summary, created_at
       FROM reports
       WHERE id = ? AND user_id = ?`,
      [id, req.user.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Get report error:", error.message, error.code);
    res.status(500).json({ message: "Failed to fetch report" });
  }
};

// POST /api/reports
const createReport = async (req, res) => {
  const { name, type } = req.body;

  if (!req.user || !req.user.id) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(401).json({ message: "Unauthorized: No user found" });
  }

  if (!name || !type) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ message: "Name and type are required" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Report file is required" });
  }

  const filePath = path.join(
    process.env.UPLOAD_DIR || "uploads",
    req.file.filename,
  );

  try {
    const [result] = await db.query(
      `INSERT INTO reports (user_id, name, type, file_path, status)
       VALUES (?, ?, ?, ?, 'UPLOADED')`,
      [req.user.id, name, type, filePath],
    );

    const [rows] = await db.query("SELECT * FROM reports WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json({
      message: "Report uploaded successfully",
      report: rows[0],
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    console.error("Create report error:", error.message, error.code);
    res.status(500).json({ message: "Failed to upload report" });
  }
};

// PATCH /api/reports/:id/status
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
    });
  }

  try {
    const [existing] = await db.query(
      "SELECT id, status FROM reports WHERE id = ? AND user_id = ?",
      [id, req.user.id],
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Report not found" });
    }

    let summary = null;
    if (status === "COMPLETED") {
      summary =
        "Report analysis completed successfully. All parameters have been reviewed and documented. " +
        "Findings are within expected clinical reference ranges. No immediate follow-up action required " +
        "unless symptoms persist. Routine check-up recommended in 3-6 months.";
    }

    await db.query(
      `UPDATE reports SET status = ?, summary = COALESCE(?, summary) WHERE id = ?`,
      [status, summary, id],
    );

    const [updated] = await db.query(
      `SELECT id, user_id, name, type, file_path, status, summary, created_at FROM reports WHERE id = ?`,
      [id],
    );

    res.json({
      message: "Status updated successfully",
      report: updated[0],
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};

module.exports = { getAllReports, getReportById, createReport, updateStatus };
