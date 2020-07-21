const express = require('express');
const app = express();
const loginRoutes = require('./routes/login_routes');
const userRoutes = require('./routes/user_routes');
const chatRoutes = require('./routes/chat_routes');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const users = [];

// routes
// app.use('/users', userRoutes);
// app.use('/chat', chatRoutes);

app.get('/', (req, res) => {
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
                user: "my.chitchat.io@gmail.com", // generated ethereal user
                pass: "septa@mychitchat", // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"My ChitChat" <my.chitchat.io@gmail.com>', // sender address
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

// register
app.get('/users', (req, res) => {
    res.json(users);
})
app.post('/users', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(req.body.password, salt)
        console.log(salt);
        console.log(hashPassword);
        const user = { name: req.body.name, password: hashPassword }
        console.log(user);
        users.push(user);
        res.status(201).send(users)
    } catch (error) {
        res.status(500);
        console.log(error);
    }
})

// login
app.use('/users/login', loginRoutes);

app.use((req, res) => {
    res.status(404).send('what are you looking for!!')
})
app.listen(3000);
