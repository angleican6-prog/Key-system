const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const keys = {};

// 5 years in milliseconds
const FIVE_YEARS = 5 * 365 * 24 * 60 * 60 * 1000;

function generateKey() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// Home route → generates key
app.get("/", (req, res) => {
    const key = generateKey();

    keys[key] = Date.now() + FIVE_YEARS;

    res.send(`
        <html>
        <body style="background:#111;color:white;font-family:sans-serif;text-align:center;padding-top:100px;">
            <h1>Your Key</h1>
            <h2>${key}</h2>
            <p>Expires in 5 years</p>
        </body>
        </html>
    `);
});

// Verify route → checks key
app.get("/verify", (req, res) => {
    const key = req.query.key;

    if (!key) {
        return res.json({ valid: false, error: "No key provided" });
    }

    if (keys[key] && Date.now() < keys[key]) {
        res.json({ valid: true });
    } else {
        res.json({ valid: false });
    }
});

// Start server (IMPORTANT for Railway)
app.listen(PORT, () => {
    console.log("Key system running on port " + PORT);
});
