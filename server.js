const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

const USERS_DB_PATH = path.join(__dirname, "users.json");

function readUsers() {
  try {
    const raw = fs.readFileSync(USERS_DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users, null, 2));
}

const courses = [
  { name: "Web Development I", subjectArea: "Computer Science", credits: 3 },
  { name: "Database Fundamentals", subjectArea: "Information Systems", credits: 4 },
  { name: "Software Development Concepts", subjectArea: "Software Engineering", credits: 3 },
  { name: "Cybersecurity Basics", subjectArea: "Cybersecurity", credits: 3 },
];

let enrollments = new Set();

function requireAdmin(req, res, next) {
  const role = req.header("x-role");
  if (role !== "administrator") {
    return res.status(403).json({ error: "Administrator role required" });
  }
  next();
}

app.post("/api/register", (req, res) => {
  const { role, username, password } = req.body;

  if (!role || !username || !password) {
    return res.status(400).json({ error: "role, username, and password are required" });
  }

  if (role !== "student" && role !== "administrator") {
    return res.status(400).json({ error: "Invalid role" });
  }

  const users = readUsers();
  const exists = users.some((u) => u.username === username);

  if (exists) {
    return res.status(409).json({ error: "Username already exists" });
  }

  users.push({ username, password, role });
  writeUsers(users);

  res.status(201).json({ role });
});

app.post("/api/login", (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }

  const users = readUsers();
  const user = users.find((u) => u.username === username);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  if (role && user.role !== role) {
    return res.status(401).json({ error: "Role does not match this account" });
  }

  res.json({ role: user.role });
});

app.get("/api/courses", (req, res) => {
  res.json(courses);
});

app.get("/api/enrollments", (req, res) => {
  res.json(Array.from(enrollments));
});

app.post("/api/enrollments", requireAdmin, (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Missing course name" });

  const exists = courses.some((c) => c.name === name);
  if (!exists) return res.status(404).json({ error: "Course not found" });

  enrollments.add(name);
  res.status(201).json({ enrolled: Array.from(enrollments) });
});

app.delete("/api/enrollments/:name", requireAdmin, (req, res) => {
  const name = decodeURIComponent(req.params.name);
  enrollments.delete(name);
  res.json({ enrolled: Array.from(enrollments) });
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});