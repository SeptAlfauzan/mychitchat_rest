const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./routes/user_routes');
const nodemailer = require('nodemailer');
// add dotenv to store secret thing
require('dotenv').config();

// const bcrypt = require('bcrypt');

mongoose.connect( process.env.DB_HOST, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((res)=>{
    console.log('connect to database');
    app.listen(process.env.PORT);
}).catch((err)=>{
    console.log(err);
})

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    // full link path
    console.log(req.protocol + '://' + req.get('host') + req.originalUrl)
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
            service: 'gmail', // true for 465, false for other ports
            auth: {
                user: process.env.GMAIL_USERNAME, // generated ethereal user
                pass: process.env.GMAIL_PASSWORD, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"My ChitChat" <'+ process.env.GMAIL_USERNAME +'>', // sender address
            to: "alfauzansepta@gmail.com", // list of receivers
            subject: "Please verify your account", // Subject line
            text: "cick here", // plain text body
            html: "<a href='blabla.com'>click here</a>", // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }

    main().catch(console.error);

})

// users
app.use('/users', userRoutes);

// app.use((req, res) => {
//     res.status(404).send('what are you looking for!!')
// })

