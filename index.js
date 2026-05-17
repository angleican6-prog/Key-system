// 1. Root Route: Generates the key for the user web page (1-minute test)
app.get("/", (req, res) => {
    const key = generateKey();

    // Store current time + 1 minute in milliseconds
    keys[key] = Date.now() + 1 * 60 * 1000;

    res.send(`
        <html>
        <body style="background:#111;color:white;font-family:sans-serif;text-align:center;padding-top:100px;">
            <h1>Your Key</h1>
            <h2 style="color:#00aaff; font-size: 40px; letter-spacing: 2px;">${key}</h2>
            <p>Expires in exactly 1 minute</p>
        </body>
        </html>
    `);
});
