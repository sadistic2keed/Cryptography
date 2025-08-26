const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3002;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Answers for validation (on server side for security)
const answers = {
  1: "Not_Half_Bad",
  2: "Solved_first_trial!",
  3: "Keep_going_kid",
};

// Simple in-memory storage for demo purposes
const userProgress = {};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API endpoint to validate answers
app.get("/validate/:level/:answer", (req, res) => {
  const level = parseInt(req.params.level);
  const userAnswer = decodeURIComponent(req.params.answer);
  const userId = req.ip;

  // Set CORS headers for cross-origin requests
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (!userProgress[userId]) {
    userProgress[userId] = { completed: { 1: false, 2: false, 3: false } };
  }

  if (userAnswer.toLowerCase() === answers[level].toLowerCase()) {
    userProgress[userId].completed[level] = true;

    const allCompleted =
      userProgress[userId].completed[1] &&
      userProgress[userId].completed[2] &&
      userProgress[userId].completed[3];

    res.json({
      correct: true,
      allCompleted: allCompleted,
      finalFlag: allCompleted ? "Flag{Dont_take_it_as_a_torture}forge" : null,
    });
  } else {
    res.json({ correct: false });
  }
});

app.listen(PORT, () => {
  console.log(`CTF app running on port ${PORT}`);
});
