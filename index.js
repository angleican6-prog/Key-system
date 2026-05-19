const express = require("express");
const app = express();

app.use(express.json());

const keys = {};

const FIVE_YEARS = 5 * 365 * 24 * 60 * 60 * 1000;

app.post("/generate", (req, res) => {
    const key = "AEBOY-" + Math.random().toString(36).substring(2, 10);

    keys[key] = {
        createdAt: Date.now(),
        expiresAt: Date.now() + FIVE_YEARS
    };

    res.json({
        key,
        expiresAt: keys[key].expiresAt
    });
});

app.post("/validate", (req, res) => {
    const { key } = req.body;

    if (!keys[key]) {
        return res.json({ valid: false, reason: "Invalid key" });
    }

    if (Date.now() > keys[key].expiresAt) {
        return res.json({ valid: false, reason: "Expired" });
    }

    res.json({ valid: true });
});

app.listen(3000, () => {
    console.log("Server running");
});
