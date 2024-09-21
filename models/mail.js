"use strict";
var nodemailer = require('nodemailer');

//send email
function sendEmail(email, token) {
 
    var email = email;
    var token = token;

    var mail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'resetpwd100@gmail.com', // Your email id
            pass: 'arurueuahbpmjyzo' // Your password
        }
    });

    var mailOptions = {
        from: 'resetpwd100@gmail.com',
        to: email,
        subject: 'Jūsų slaptažodžio keitimo nuoroda',
        //html: '<p>You requested for reset password, kindly use this token ' + token + ' to reset your password by using this <a href="http://10.0.2.5:3000/resetPasswordc?token=' + token + '">link</a></p>'
        //html: '<p>Nor&#279dami pakeisti savo slapta&#382od&#303, paspauskite &#353i&#261 nuorod&#261 <a href="http://10.0.2.5:3000/resetPasswordc?token=' + token + '">link</a> ir &#303veskite token&#261' + token + 'su nauju slapta&#382od&#382iu</p>'
        html: '<p>Norėdami pasikeisti savo slaptažodį, paspauskite šią <a href="http://10.0.2.5:3000/resetPasswordc?token=' + token + '">nuorodą</a> ir įveskite tokeną ' + token + ' su nauju slaptažodžiu</p>'
    };

    mail.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(1)
        } else {
            console.log(0)
        }
    });
}

module.exports = {
    sendEmail: sendEmail
};