const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const users = [];

router.get('/', (req, res)=>{
    res.send('ok')
})

router.post('/', async (req, res)=>{
    try {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const user = { name: req.body.name, password: hashPassword};
        users.push(user);
        res.status(201).send(users);
    } catch (error) {
        res.status(500);
    }
})

router.put('/:id', (req, res)=>{})

router.delete('/:id', (req, res)=>{})


module.exports = router;