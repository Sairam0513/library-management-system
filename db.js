// db.js
const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Failed to connect to MySQL:", err.message);
  } else {
    console.log("✅ Connected to MySQL database");
    connection.release();
  }
});

module.exports = pool.promise();
