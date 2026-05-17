const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const keys = {};

function generateKey() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}

app.get("/", (req, res) => {
    const key = generateKey();

    keys[key] = Date.now() + 24 * 60 * 60 * 1000;

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

app.get("/verify", (req, res) => {
    const key = req.query.key;

    if (keys[key] && Date.now() < keys[key]) {
        res.json({ valid: true });
    } else {
        res.json({ valid: false });
    }
});

app.listen(PORT, () => {
    console.log("Key system online");
});
