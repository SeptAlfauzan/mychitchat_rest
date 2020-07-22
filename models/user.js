const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        maxlength: 20
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    profile_pic: {
        type: String,
        required: false
    },
    verified: {
        type: Boolean,
        required: true
    }
}, { timestamps: true, autoIndex: true });

const User = mongoose.model('User', userSchema);

module.exports = {
    User: User
}