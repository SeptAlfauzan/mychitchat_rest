const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./routes/user_routes');
const nodemailer = require('nodemailer');

const http = require('http');
const server = http.createServer(express);

const methodOverride = require('method-override');
// add dotenv to store secret thing
require('dotenv').config();
// const bcrypt = require('bcrypt');

const { socketServer } = require('./websocket_server');

// mongoose.connect( process.env.DB_HOST, {
//     dbName: process.env.DB_NAME,
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then((res)=>{
//     console.log('connect to database');
//     console.log(process.env.PORT);
    app.listen(process.env.PORT || 4000);

    socketServer.run;
    // run the websocket server
// }).catch((err)=>{
//     console.log(err);
// })

const errHandlerMulter = (err, req, res, next)=>{
    if (err instanceof multer.MulterError) {
        res.json({
            message: err.message
        })
    }
}


app.set('view engine', 'ejs')
// set static path for avatar image
app.use('/profile', express.static(`${__dirname}/upload/images/avatars`))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
// require and enable cors
const cors = require('cors')
app.use(cors());

app.get('/', (req, res) => {
    // full link path
    res.send('ok');
    console.log(req.protocol + '://' + req.get('host') + req.originalUrl)
})

// chat room page
app.get('/chat/chat-room', (req, res) => {
    res.render('chat/index');
})

app.get('/emails', (req, res) => {
    res.send('ok');

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
        const name = "septa";
        const url_verfify = "septa";

        let info = await transporter.sendMail({
            from: '"My ChitChat" <'+ process.env.GMAIL_USERNAME +'>', // sender address
            to: "alfauzansepta@gmail.com", // list of receivers
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

})
// delete before deploy it

// users
app.use('/users', userRoutes);

// app.use((req, res) => {
//     res.status(404).send('what are you looking for!!')
// })

