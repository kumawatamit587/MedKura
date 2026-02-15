const express = require("express");
const router = express.Router();
const { login, signup } = require("../controllers/authController");

// POST /api/auth/login
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
