const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const keys = {};

// your special lifetime key
const LIFETIME_KEY = "SEL4KNOL";

function generateKey() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function getExpiry(isLifetime) {
    if (isLifetime) {
        return Date.now() + (5 * 365 * 24 * 60 * 60 * 1000); // 5 years
    }
    return Date.now() + (24 * 60 * 60 * 1000); // 24 hours
}

// generate normal keys
app.get("/", (req, res) => {
    const key = generateKey();

    keys[key] = getExpiry(false); // ALWAYS 24h for generated keys

    res.send(`
        <h1>Your Key</h1>
        <h2>${key}</h2>
        <p>Expires in 24 hours</p>
    `);
});

// optional: manually register lifetime key
keys[LIFETIME_KEY] = getExpiry(true);

// verify
app.get("/verify", (req, res) => {
    const key = req.query.key;

    if (!key) return res.json({ valid: false });

    // lifetime key bypass
    if (key === LIFETIME_KEY) {
        return res.json({ valid: true, type: "lifetime" });
    }

    if (keys[key] && Date.now() < keys[key]) {
        return res.json({ valid: true, type: "normal" });
    }

    return res.json({ valid: false });
});

app.listen(PORT, () => {
    console.log("Running");
});
