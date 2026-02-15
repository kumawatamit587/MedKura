const mysql = require("mysql2/promise");
require("dotenv").config();

// Validate required environment variables
const requiredVars = [
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
];
const missing = requiredVars.filter((v) => !process.env[v]);
if (missing.length > 0) {
  console.error("Missing environment variables:", missing.join(", "));
  console.error("Please ensure all required variables are set in .env file");
}

// using a pool so we don't create a new connection on every query
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
});

// Add error handler to pool
pool.on("error", (err) => {
  console.error("Unexpected database pool error:", err.message);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.error("Database connection was closed.");
  }
  if (err.code === "PROTOCOL_ERROR") {
    console.error("Database protocol error.");
  }
  if (err.code === "ER_CON_COUNT_ERROR") {
    console.error("Database has too many connections.");
  }
  if (err.code === "ER_AUTHENTICATION_PLUGIN_ERROR") {
    console.error("Database authentication failed.");
  }
  if (err.code === "ENOTFOUND") {
    console.error("Database host not found.");
  }
});

// quick helper so we can just do db.query() everywhere
const db = {
  query: (sql, params) => pool.execute(sql, params),
  pool,
};

module.exports = db;
