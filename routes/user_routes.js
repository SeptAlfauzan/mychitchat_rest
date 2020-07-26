const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const { User } = require('../models/user');
const { email_verification } = require('../email/send_email');

// define and set destination file for profile picture(avatar)
const storage_avatar = multer.diskStorage({
    // set destination folder
    destination: './upload/images/avatars',
    filename: (req, file, callback) => {
        // set filename and the extenstion, so it basicly convert from binary file into real file
        return callback(null, `${file.fieldname}_profile_${Date.now()}${path.extname(file.originalname)}`)
    }
})
// middleware to upload image using multer
const upload_avatar = multer({
    storage: storage_avatar,
    limits: {
        // maxsize 2 MB
        fileSize: 2 * 1024 * 1024
    }
})


router.get('/', async (req, res) => {
    try{
        const users = await User.find().sort({ createdAt: -1 }).then(result => result).catch(err => console.log(err));
        res.status(200).json(users);
    }catch(err){
        console.log(err);
    }
})

router.post('/upload', (req, res) => {
    upload_avatar.single('file')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // handling error of multer
            res.status(400).json({
                image_error: true,
                message: err.message
            })
        } else if (err){
            // handling an unknown err while uploading file
            res.status(400).json({
                message: err.message
            })
        } else{
            // everything works fine
            console.log(req.file);
            res.status(200).json({
                message: 'success',
                fileName: req.file.filename
            });
        }

    })
})

// register
router.post('/', async (req, res) => {
    try {
        // check if there is account that already use email address or username 
        const users = await User.find().sort({ createdAt: -1 }).then(result => result).catch(err => console.log(err));
        const username = req.body.username;
        const name = req.body.name;
        const email = req.body.email;

        if (users.find(user => user.email == email)) {
            res.json({
                result: false,
                detail: 'email already used'
            });
        } else {
            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(req.body.password, salt);
            // replace plain password to hashed password
            req.body.password = hashPassword;
            console.log(req.body);
            const user = new User(req.body);
            user.save().then((result) => {
                const url_verification = `http://${req.get('host')}${req.originalUrl}/verify/${user._id}`;
                console.log(url_verification);
                // send email verification
                email_verification(name, email, url_verification);
                res.status(201).send({
                    result: true,
                    detail: 'new account registered, check your email.'
                });
                console.log('success');
            }).catch((err) => console.log(err))
        }
    } catch (error) {
        res.status(500);
    }
})

// resend email


router.post('/login', async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 }).then(result => result).catch(err => console.log(err));

    const user = await users.find(user => user.email == req.body.email);

    if (user == null) {
        return res.status(400).json({
            result: false,
            kind_of_error: 'email',
            detail: 'email not registered!'
        });
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            if (user.verified == false) {
                res.status(400).json({
                    result: false,
                    kind_of_error: 'email',
                    detail: 'account not virified yet!'
                })
            } else {
                res.status(200).json({
                    result: true,
                    detail: 'login allowed.'
                });
            }
        } else {
            res.status(400).json({
                result: false,
                kind_of_error: 'password',
                detail: 'password wrong'
            });
        }
    } catch (error) {
        res.status(500);
        console.log(error);
    }
})

// router.put('/:id', (req, res)=>{})
router.put('/verify/:id', (req, res) => {
    const id = req.params.id;
    User.findByIdAndUpdate(id, { $set: { verified: true } }, { useFindAndModify: false }).then((result) => {
        res.json({
            result: true,
            detail: 'account already verified'
        });
        console.log(result.name);

        // res.redirect('/users/verified');

    }).catch((err) => console.log(err))
})

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    User.findByIdAndDelete(id).then((result) => {
        res.json({
            result: true,
            detail: 'account has been deleted'
        });
    }).catch((err) => console.log(err));
})
// rediredt
router.get('/verified', (req, res) => {
    res.render('account/verified_success/index', { title: 'Your Account Already Verified' });
})

module.exports = router;