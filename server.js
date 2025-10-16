const express = require("express");
const session = require("express-session");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Handle JSON requests if needed
app.use(express.static(path.join(__dirname, "frontend"))); // Serve static frontend files

// ✅ Session middleware — must come before routes
app.use(
  session({
    secret: process.env.SESSION_SECRET || "library_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // 🔴 Must be false for HTTP (localhost)
      maxAge: 1000 * 60 * 60 // Optional: 1 hour session
    }
  })
);

// ✅ Routes
const authRoutes = require("./routes/auth");   // For student login/signup if used here
const staffRoutes = require("./routes/staff"); // Your main staff routes

app.use("/", authRoutes);   // Optional: student routes
app.use("/", staffRoutes);  // Mount staff routes

// ✅ Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// ✅ Student login page
app.get("/student", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "student.html"));
});

// ✅ Protected Student Dashboard
app.get("/student_dashboard.html", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/student");
  }
  res.sendFile(path.join(__dirname, "frontend", "student_dashboard.html"));
});

// ✅ Staff login page
app.get("/staff", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "staff_login.html"));
});

// ✅ Protected Staff Dashboard
app.get("/staff_dashboard.html", (req, res) => {
  if (!req.session.staff) {
    return res.redirect("/staff");
  }
  res.sendFile(path.join(__dirname, "frontend", "staff_dashboard.html"));
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
