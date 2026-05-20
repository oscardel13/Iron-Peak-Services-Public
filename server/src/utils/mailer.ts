const nodemailer = require('nodemailer');

require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    // secure: true,
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD
    }
  });

function sendMail(to, subject, text){
    const mail = {
        from: `Blueprint Barbers <${process.env.GMAIL_EMAIL}>`,
        to,
        subject,
        text
    }
    transporter.sendMail(mail, (error, info) =>{
        if (error){
            console.log(error)
        }
    })
}

module.exports = {
  sendMail
}