const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

router.post('/', async (req, res) => {
    const user = users.find(user => user.name == req.body.name);
    if (user == null) {
        return res.status(400).send('cannot find user');
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send('allowed');
        } else {
            res.send('not allowed');
        }
    } catch (error) {
        res.status(500);
        console.log(error);
    }
})

module.exports = router;