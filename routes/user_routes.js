const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models/user');

router.get('/', (req, res)=>{
    res.send('ok')
})

router.post('/', async (req, res)=>{
    try {
// check if there is account that already use email address or username 
        const users = await User.find().sort({ createdAt: -1 }).then(result=>result).catch(err=>console.log(err));

        if (users.find(user => user.username == req.body.username)) {
            res.send({
                result: false,
                detail: 'username already taken'
            });
        }else if(users.find(user => user.email == req.body.email)){
            res.send({
                result: false,
                detail: 'email already used'
            });

        }else{
            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(req.body.password, salt);
            // replace plain password to hashed password
            req.body.password = hashPassword;

            const user = new User(req.body);
            user.save().then((result)=>{
                res.status(201).send({
                    result: true,
                    detail: users
                });
            }).catch((err)=>console.log(err))
        }
    } catch (error) {
        res.status(500);
    }
})

router.post('/login', async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 }).then(result=>result).catch(err=>console.log(err));
    
    const user = await users.find(user => user.username == req.body.username_email || user.email == req.body.username_email);


    if (user == null) {
        return res.status(400).send({
            result: false,
            detail: 'email or username not registered!'
        });
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            if (user.verified == false) {
                res.send({
                    result: false,
                    detail: 'account not virified yet!'
                })
            }else{
                res.send({
                    result: true,
                    detail: 'login allowed.'
                });
            }
        } else {
            res.send({
                result: false,
                detail: 'password wrong'
            });
        }
    } catch (error) {
        res.status(500);
        console.log(error);
    }
})

// router.put('/:id', (req, res)=>{})
router.put('/verify/:id', (req, res)=>{
    const id = req.params.id;
    User.findByIdAndUpdate(id, { $set: { verified: true }}, { useFindAndModify: false }).then((result)=>{
        res.send({
            result: true,
            detail: 'account already verified'
        })
    }).catch((err)=>console.log(err))
})

router.delete('/:id', (req, res)=>{
    const id = req.params.id;
    User.findByIdAndDelete(id).then((result)=>{
        res.send({
            result: true,
            detail: 'account has been deleted'
        })
    }).catch((err)=>console.log(err));
})

module.exports = router;