const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
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
        default: false,
        type: Boolean,
        // required: true
    }
}, { timestamps: true, autoIndex: true });

const User = mongoose.model('User', userSchema);

module.exports = {
    User: User
}