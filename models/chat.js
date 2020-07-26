const mongoose = require('mongoose');
const schema = mongoose.Schema;

const chatSchema = new schema({
    sender: {
        type: String,
        required: true
    },
    reciever: {
        type: String,
        required: true
    },
    chat_content: {
        type: String,
        required: true
    },
    broadcast: {
        type: Boolean,
        required: true
    }
}, { timestamps: true, autoIndex: true });

const Chat = mongoose.model('Chat', chatSchema);

module.exports = {
    Chat: Chat
}