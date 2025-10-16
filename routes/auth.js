const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");

// Student Signup Route
router.post("/signup", async (req, res) => {
  const { full_name, email, username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO students (full_name, email, username, password) VALUES (?, ?, ?, ?)",
      [full_name, email, username, hashedPassword]
    );

    res.redirect("/student_dashboard.html");
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).send("Signup failed. Username or email may already exist.");
  }
});

// Student Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.execute("SELECT * FROM students WHERE username = ?", [username]);

    if (rows.length === 0) {
      return res.status(401).send("Invalid username or password");
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send("Invalid username or password");
    }

    req.session.user = user;
    res.redirect("/student_dashboard.html");
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).send("Login failed due to server error.");
  }
});
// Get logged-in student info
router.get("/student-info", (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "Not logged in" });

  const { full_name, email } = req.session.user;
  res.json({ full_name, email });
});

// Get list of available books from DB
router.get("/available-books", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT title, author FROM books");
    res.json(rows);
  } catch (err) {
    console.error("Book fetch error:", err.message);
    res.status(500).json({ error: "Failed to load books" });
  }
});
// GET available books from DB
router.get("/available-books", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT title, author FROM books");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching books:", err.message);
    res.status(500).json({ error: "Failed to load books" });
  }
});


module.exports = router;
