const nodemailer = require('nodemailer');
// add dotenv to store secret thing
require('dotenv').config();

const email_verification = (name, email_reciver, url_verfify)=>{
    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.GMAIL_USERNAME, // generated ethereal user
                pass: process.env.GMAIL_PASSWORD, // generated ethereal password
            },
        });

        // send mail with defined transport object

        let info = await transporter.sendMail({
            from: '"My ChitChat" <'+ process.env.GMAIL_USERNAME +'>', // sender address
            to: email_reciver, 
            subject: "Please verify your account", // Subject line
            text: "cick here", // plain text body
            html: `
                    <div style="font-family: sans-serif !important; width: 80%; padding: 30px; margin: auto">
                    <div style="width: 100%; padding-bottom: 30px; padding-bottom: 30px; text-align: center">
                        <img align="center" alt="" src="https://mcusercontent.com/26588a9e11083c8fa94b45953/images/419bd65f-4921-4bce-8f02-4a03788c1000.png" width="81.92" style="max-width: 512px; padding-bottom: 0px; vertical-align: bottom; display: inline !important; border-radius: 0%;" class="mcnImage">
                        <h2 style="font-size: 30px; color: #121212">my.chichat</h2>
                    </div>

                    <h3 style="font-size: 27px; color: #121212" align="center">${name}, please verify your email account</h3>

                    <p style="font-size: 18px; color: #121212" align="center">Click button bellow to verify your account&nbsp;</p>

                    <div style="border-collapse: separate !important;border-radius: 7px;background-color: #00B4BA; width: 200px; text-align: center; margin: auto">
                        <a class="mcnButton " title="verify account" href="${url_verfify}" target="_blank" style="font-family: Helvetica; font-size: 18px; padding: 18px; display: block;font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;">verify account</a>
                    </div>
                    </div>

            `, // html body
        });
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
    main().catch(console.error);
}

module.exports = {
    email_verification: email_verification
}