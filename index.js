const express = require("express");
const app = express();

app.use(express.json());

// In-memory key storage (NOTE: resets when server restarts)
const keys = {};

// 5 years in milliseconds
const FIVE_YEARS = 5 * 365 * 24 * 60 * 60 * 1000;

// Generate Key
app.post("/generate", (req, res) => {
    const key = "AEBOY-" + Math.random().toString(36).substring(2, 10);

    keys[key] = {
        createdAt: Date.now(),
        expiresAt: Date.now() + FIVE_YEARS
    };

    res.json({
        success: true,
        key: key,
        expiresAt: keys[key].expiresAt
    });
});

// Validate Key
app.post("/validate", (req, res) => {
    const { key } = req.body;

    if (!key) {
        return res.json({ valid: false, reason: "No key provided" });
    }

    const data = keys[key];

    if (!data) {
        return res.json({ valid: false, reason: "Invalid key" });
    }

    if (Date.now() > data.expiresAt) {
        return res.json({ valid: false, reason: "Expired key" });
    }

    return res.json({ valid: true });
});

// Home route
app.get("/", (req, res) => {
    res.send("Key system is running");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
