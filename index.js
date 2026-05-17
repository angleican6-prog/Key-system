const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Memory storage for keys
const keys = {};

function generateKey() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// 1. Root Route: Generates the key for the user web page
app.get("/", (req, res) => {
    const key = generateKey();

    // Store current time + 24 hours in milliseconds
    keys[key] = Date.now() + 24 * 60 * 60 * 1000;

    res.send(`
        <html>
        <body style="background:#111;color:white;font-family:sans-serif;text-align:center;padding-top:100px;">
            <h1>Your Key</h1>
            <h2 style="color:#00aaff; font-size: 40px; letter-spacing: 2px;">${key}</h2>
            <p>Expires in exactly 24 hours</p>
        </body>
        </html>
    `);
});

// 2. Verification Route: Read by your Roblox script
app.get("/verify", (req, res) => {
    const userKey = req.query.key;

    // Check if key exists in our memory registry
    if (!userKey || !keys[userKey]) {
        return res.json({ valid: false, message: "Key does not exist" });
    }

    // Check if the current time has passed the expiration timestamp
    if (Date.now() > keys[userKey]) {
        delete keys[userKey]; // Delete it immediately if someone tries to use an expired key
        return res.json({ valid: false, message: "Key has expired" });
    }

    // Key is active and valid!
    return res.json({ valid: true });
});

// 3. Background Cleaner: Runs every 60 minutes to clear out dead keys from RAM
setInterval(() => {
    const now = Date.now();
    for (const key in keys) {
        if (now > keys[key]) {
            delete keys[key];
        }
    }
    console.log("Cleaned up expired keys from memory storage.");
}, 60 * 60 * 1000); // 60 minutes * 60 seconds * 1000 ms

app.listen(PORT, () => {
    console.log(`Key system online on port ${PORT}`);
});
