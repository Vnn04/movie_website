const nodeMailer = require("nodemailer");
const mailConfig = require("../config/mail.config");
require('dotenv/config');

exports.sendMail = (to, subject, htmlContent) => {
    const transport = nodeMailer.createTransport({
        host: mailConfig.HOST,
        port: mailConfig.PORT,
        secure: false,
        auth: {
            user: mailConfig.USERNAME,
            pass: mailConfig.PASSWORD
        }
    })

    const options = {
        from: mailConfig.FROM_ADDRESS,
        to: to,
        subject,
        html: htmlContent
    }
    return transport.sendMail(options);
}