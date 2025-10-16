const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");

// Staff Signup Route
router.post("/staff-signup", async (req, res) => {
  const { full_name, email, username, password } = req.body;

  if (!full_name || !email || !username || !password) {
    return res.status(400).send("All fields are required");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO staff (full_name, email, username, password) VALUES (?, ?, ?, ?)",
      [full_name, email, username, hashedPassword]
    );

    // Set session and redirect
    const [rows] = await db.execute("SELECT * FROM staff WHERE username = ?", [username]);
    req.session.staff = rows[0];

    res.redirect("/staff_dashboard.html");
  } catch (err) {
    console.error("❌ Staff Signup Error:", err.message);
    res.status(500).send("Staff signup failed. Username or email may already exist.");
  }
});

// Staff Login Route
router.post("/staff-login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("All fields are required");
  }

  try {
    const [rows] = await db.execute("SELECT * FROM staff WHERE username = ?", [username]);

    if (rows.length === 0) {
      return res.status(401).send("Invalid username or password");
    }

    const staff = rows[0];
    const isMatch = await bcrypt.compare(password, staff.password);

    if (!isMatch) {
      return res.status(401).send("Invalid username or password");
    }

    req.session.staff = staff;
    res.redirect("/staff_dashboard.html");
  } catch (err) {
    console.error("❌ Staff Login Error:", err.message);
    res.status(500).send("Login failed due to server error.");
  }
});

// Get logged-in staff info
router.get("/staff-info", (req, res) => {
  if (!req.session.staff) return res.status(401).json({ error: "Unauthorized" });

  const { full_name, email } = req.session.staff;
  res.json({ full_name, email });
});

module.exports = router;
