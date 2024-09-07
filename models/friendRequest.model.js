const mongoose = require('mongoose');

const FriendRequestSchema = new mongoose.Schema({
    senderId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true},
    receiverId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true},
    status: {type: String, default: 'pending'},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FriendRequest', FriendRequestSchema)