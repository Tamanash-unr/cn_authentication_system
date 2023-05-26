
const nodemailer = require('../config/nodemailer');
const env = require('../config/environment');

exports.sendResetLink = (user, token)=>{
    // Get Html format for email from ejs file
    let htmlString = nodemailer.renderTemplate({user: user, clientUrl: env.client_url, token: token}, '/resetLink.ejs');

    nodemailer.transporter.sendMail({
        from: 'Authsys <no-reply@authsys.com>',
        replyTo: 'no-reply@authsys.com',
        to: user.email,
        subject: "Authsys - Password Reset Link",
        html: htmlString
    }, (err, info)=>{
        if(err){
            console.log('Error in sending mail:', err);
            return;
        }

        console.log('Message Sent:', info);
        return;
    })
}