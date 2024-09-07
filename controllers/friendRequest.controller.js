const FriendRequest = require('../models/friendRequest.model');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// const { error } = require('console');
// const { json } = require('express');

exports.sendFriendRequest = async(req, res) => {
    const {token, receiverId} = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const senderId = decoded.user.id;

        const sender = await User.findById(senderId)
        const receiver = await User.findById(receiverId);

        const friendRequest = new FriendRequest({
            senderId,
            receiverId
        });
        await friendRequest.save();

        res.status(200).json({success: true, message: 'friend request sent successfully', friendRequest});

    } catch (error) {
        res.status(404).json({message: error.message});
    }
}


exports.getFriendRequest = async (req, res) => {
    const { token } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id;

        // Tìm tất cả các yêu cầu kết bạn mà người dùng là người nhận
        const friendRequests = await FriendRequest.find({
            receiverId: userId
        }).populate('senderId', 'email username')
        .populate('receiverId', 'email username')
 

        res.status(200).json({ success: true, friendRequests });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
