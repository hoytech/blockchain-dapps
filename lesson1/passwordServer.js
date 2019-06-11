const express = require('express');
const app = express();
const port = 7681;

app.use(express.urlencoded({ extended: true }));
app.post('/login', handleLogin);

app.get('/', (req, res) => res.status(404).send('404 not found'));
app.listen(port, () => console.log(`Secure login app listening on port http://localhost:${port}`))


function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function handleLogin(req, res) {
    if (!req.body['password']) return res.status(400).send('missing password');
    let attempt = req.body['password'].split('');
    let pass = [13944,10520,11535,10920,12383,12383,11744,12819,11328];
    for (let i=0; i<Math.max(attempt.length, pass.length); i++) {
        if (attempt[i] !== String.fromCharCode(Math.sqrt(pass[i] - 719))) return res.status(403).send('bad password');
        await sleep(50);
    }

    res.send("Login successful.");
}
