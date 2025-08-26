const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

// Serve static files from the same directory
app.use(express.static(path.join(__dirname)));

// Answers for validation
const answers = {
  1: "Not_Half_Bad",
  2: "Solved_first_trial!",
  3: "Keep_going_kid",
};

// Simple in-memory storage for demo purposes
// In a real application, use a database or sessions
const userProgress = {};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API endpoint to validate answers
app.get("/validate/:level/:answer", (req, res) => {
  const level = parseInt(req.params.level);
  const userAnswer = decodeURIComponent(req.params.answer);
  const userId = req.ip; // Simple user identification

  if (!userProgress[userId]) {
    userProgress[userId] = { completed: { 1: false, 2: false, 3: false } };
  }

  if (userAnswer.toLowerCase() === answers[level].toLowerCase()) {
    userProgress[userId].completed[level] = true;

    // Check if all challenges are completed
    const allCompleted =
      userProgress[userId].completed[1] &&
      userProgress[userId].completed[2] &&
      userProgress[userId].completed[3];

    res.json({
      correct: true,
      allCompleted: allCompleted,
      finalFlag: allCompleted ? "Flag{Don't_take_it_as_a_torture}forge" : null,
    });
  } else {
    res.json({ correct: false });
  }
});

app.listen(3001, () => {
  console.log(`CTF app running at http://localhost:3001`);
});
