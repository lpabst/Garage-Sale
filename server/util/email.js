var nodemailer = require('nodemailer');
const config = require('../config');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: config.gmailAuth
});

function sendEmail(email) {
    let { to, subject, text } = email;
    if (!to || !subject || !text)
        return { error: false, success: false, message: 'To send email, please include toAddress, subject, and text' }
    return new Promise((resolve, reject) => {
        transporter.sendMail(email, function (error, info) {
            if (error) {
                return reject({ error: true, success: false, Error: error, message: error.stack })
            } else {
                return resolve({ error: false, success: true, message: 'Success' })
            }
        });
    })
}

module.exports = {
    sendEmail,
}

// Follow step 1 of this guide to get Gmail API clientId & secret 
// (make sure to put Google playground in the authorized redirect Uri https://developers.google.com/oauthplayground)
// https://developers.google.com/gmail/api/quickstart/nodejs
// Then follow this link for the refresh token:
// https://stackoverflow.com/questions/24098461/nodemailer-gmail-what-exactly-is-a-refresh-token-and-how-do-i-get-one

// manage the API here
// https://console.developers.google.com/apis/dashboard