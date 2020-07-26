const mongoose = require('mongoose');
const schema = mongoose.Schema;

const groupSchema = new schema({
    name: {
        type: String,
        required: true,
        maxlength: 18
    },
    description: {
        type: String,
        required: false,
    },
    members: {
        type: Array,
        required: true
    },
    admins: {
        type: Array,
        required: true
    }
}, { timestamps: true, autoIndex: true });

const Group = mongoose.model('Group', groupSchema);

module.exports = {
    Group: Group
}