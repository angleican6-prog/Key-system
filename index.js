const express = require("express");
const app = express();

app.use(express.json());

// simple in-memory key storage
let keys = {};

// 🔑 Generate a key (opens in browser)
app.get("/generate", (req, res) => {
    const key = Math.random().toString(36).substring(2, 10).toUpperCase();

    // expires in 24 hours
    keys[key] = Date.now() + 24 * 60 * 60 * 1000;

    res.json({
        key: key,
        expires_in: "24h"
    });
});

// ✅ Validate a key (used by your Roblox GUI)
app.post("/validate", (req, res) => {
    const { key } = req.body;

    if (!key) {
        return res.json({ valid: false, reason: "no_key" });
    }

    const expiry = keys[key];

    // key doesn't exist
    if (!expiry) {
        return res.json({ valid: false, reason: "invalid" });
    }

    // expired key
    if (Date.now() > expiry) {
        delete keys[key];
        return res.json({ valid: false, reason: "expired" });
    }

    // valid key
    return res.json({ valid: true });
});

// start server
app.listen(process.env.PORT || 3000, () => {
    console.log("Key system running");
});
