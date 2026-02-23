const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;


app.use(express.json());


app.use(express.static(__dirname));


const courses = [
  { name: "Web Development I", subjectArea: "Computer Science", credits: 3 },
  { name: "Database Fundamentals", subjectArea: "Information Systems", credits: 4 },
  { name: "Software Development Concepts", subjectArea: "Software Engineering", credits: 3 },
  { name: "Cybersecurity Basics", subjectArea: "Cybersecurity", credits: 3 },
];

let enrollments = new Set();


app.get("/api/courses", (req, res) => {
  res.json(courses);
});

app.get("/api/enrollments", (req, res) => {
  res.json(Array.from(enrollments));
});

app.post("/api/enrollments", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Missing course name" });

  const exists = courses.some(c => c.name === name);
  if (!exists) return res.status(404).json({ error: "Course not found" });

  enrollments.add(name);
  res.status(201).json({ enrolled: Array.from(enrollments) });
});

app.delete("/api/enrollments/:name", (req, res) => {
  const name = decodeURIComponent(req.params.name);
  enrollments.delete(name);
  res.json({ enrolled: Array.from(enrollments) });
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});