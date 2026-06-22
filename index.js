const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// 🔑 Lifetime keys
const LIFETIME_KEYS = [
    "SEL4KNOL",
    "DFAJK4OM"
];

// normal generated keys
const keys = {};

function generateKey() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// 24h expiry
function getExpiry() {
    return Date.now() + (24 * 60 * 60 * 1000);
}

// Generate 24h keys
app.get("/", (req, res) => {
    const key = generateKey();

    keys[key] = getExpiry();

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

// Verify keys
app.get("/verify", (req, res) => {
    const key = req.query.key;

    // User logging
    const ip =
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress;

    console.log("------ KEY CHECK ------");
    console.log("Key:", key);
    console.log("IP:", ip);
    console.log("Time:", new Date().toISOString());
    console.log("User-Agent:", req.headers["user-agent"]);
    console.log("-----------------------");


    if (!key) {
        return res.json({ valid: false });
    }


    // Lifetime keys
    if (LIFETIME_KEYS.includes(key)) {
        return res.json({
            valid: true,
            type: "lifetime"
        });
    }


    // Normal 24h keys
    if (keys[key] && Date.now() < keys[key]) {
        return res.json({
            valid: true,
            type: "24h"
        });
    }


    return res.json({ 
        valid: false 
    });
});


app.listen(PORT, () => {
    console.log("Key system running");
});
