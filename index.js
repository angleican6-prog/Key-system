const express = require("express");
const crypto = require("crypto");

const app = express();
app.use(express.json());

// simple in-memory storage (resets on restart)
const keys = new Map();

// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Key system is running");
});

// GENERATE KEY ROUTE
app.post("/generate", (req, res) => {
  const userId = req.body.userId || "default";

  // generate key
  const key = crypto.randomBytes(16).toString("hex");

  // expire time (5 years)
  const expiresAt = Date.now() + (5 * 365 * 24 * 60 * 60 * 1000);

  keys.set(key, { userId, expiresAt });

  res.json({
    key: key,
    expiresAt: expiresAt
  });
});

// VERIFY KEY ROUTE
app.post("/verify", (req, res) => {
  const { key } = req.body;

  const data = keys.get(key);

  if (!data) {
    return res.json({ valid: false, reason: "Invalid key" });
  }

  if (Date.now() > data.expiresAt) {
    return res.json({ valid: false, reason: "Expired key" });
  }

  res.json({ valid: true, userId: data.userId });
});

// START SERVER (IMPORTANT FOR RAILWAY)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
