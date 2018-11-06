const helper = require('sendgrid').mail;
const config = require('./../config');
const sg = require('@sendgrid/mail');
sg.setApiKey(config.sendgridApiKey);

// We need to put the fromEmail as the email used to sign up for the sendgrid account.
// Using someone else's email as the fromEmail will probably put it in spam I think
function sendEmail(toEmail, subject, body) {
    if (!toEmail || !subject || !body) return { error: true, message: 'Please provide all 4 fields to send an email' }

    const msg = {
        to: toEmail,
        from: 'prodEmail@gmail.com', // udpate this
        subject,
        text: body,
        html: body
    };

    return sg.send(msg)
        .then(() => {
            return { error: false, message: 'Success' };
        })
        .catch(e => {
            return { error: true, message: e }
        })
}

module.exports = {
    sendEmail,
}