const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const keys = {};

// 5-year key (your special user)
const FIVE_YEARS = 5 * 365 * 24 * 60 * 60 * 1000;
keys["SEL4KNOL"] = Date.now() + FIVE_YEARS;

// generate random key
function generateKey() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// 24-hour expiry for normal users
const ONE_DAY = 24 * 60 * 60 * 1000;

// generate page
app.get("/", (req, res) => {
    const key = generateKey();

    // everyone else = 24h key
    keys[key] = Date.now() + ONE_DAY;

    res.send(`
        <html>
        <body style="background:#111;color:white;font-family:sans-serif;text-align:center;padding-top:100px;">
            <h1>Your Key</h1>
            <h2>${key}</h2>
            <p>Expires in 24 hours</p>
        </body>
        </html>
    `);
});

// verify key
app.get("/verify", (req, res) => {
    const key = req.query.key;

    if (!key) return res.json({ valid: false });

    if (keys[key] && Date.now() < keys[key]) {
        return res.json({ valid: true });
    }

    return res.json({ valid: false });
});

app.listen(PORT, () => {
    console.log("Key system running");
});
