const express = require("express");
const app = express();

app.use(express.json());

// store keys in memory (simple version)
const keys = {};

// 24 hour limit
const EXPIRY_TIME = 24 * 60 * 60 * 1000;

// ------------------------
// Generate Key
// ------------------------
app.get("/generate", (req, res) => {
    const key = Math.random().toString(36).substring(2, 10).toUpperCase();

    keys[key] = {
        createdAt: Date.now()
    };

    res.json({
        key: key,
        expiresIn: "24h"
    });
});

// ------------------------
// Validate Key
// ------------------------
app.get("/validate", (req, res) => {
    const key = req.query.key;

    const data = keys[key];

    if (!data) {
        return res.json({ valid: false, reason: "not_found" });
    }

    const now = Date.now();

    if (now - data.createdAt > EXPIRY_TIME) {
        return res.json({ valid: false, reason: "expired" });
    }

    return res.json({ valid: true });
});

// ------------------------
// Fix Railway "Cannot GET /"
// ------------------------
app.get("/", (req, res) => {
    res.send("Key system online");
});

// ------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
