const FriendRequest = require('../models/friendRequest.model');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// const { error } = require('console');
// const { json } = require('express');

exports.sendFriendRequest = async (req, res) => {
    const { token, receiverId } = req.body;
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

        res.status(200).json({ friendRequest });

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


exports.getFriendRequest = async (req, res) => {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id;

        const friendRequests = await FriendRequest.find({
            receiverId: userId
        }).populate('senderId', '_id email username image')
            .populate('receiverId', '_id email username image')


        res.status(200).json({ friendRequests });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.isPending = async (req, res) => {
    const {token, receiverId} = req.body
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id

        const friendRequest = await FriendRequest.find({
            senderId: userId,
            receiverId: receiverId
        }).populate('senderId', 'email username')
        .populate('receiverId', 'email username')
        res.status(200).json({friendRequest});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


exports.deleteFriendRequest = async (req, res) => {
    const { id } = req.query;
    try {
        const friendRequest = await FriendRequest.findById(id)

        if(!friendRequest){
            return res.status(404).json({message: 'friend request not found'});
        }

        await FriendRequest.findByIdAndDelete(id);
        return res.status(200).json({message: 'Friend request deleted'});

    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};

exports.removeFriendRequestOnUsers = async (req, res) => {
    const{token, id2} = req.body;
    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user1 = decoded.user.id

        const friendRequest = await FriendRequest.findOneAndDelete({
            senderId: user1,
            receiverId: id2
        });

        if (!friendRequest) {
            return res.status(404).json({ success: false, message: 'Friend request not found' });
        }

        res.status(200).json({success: true});

    } catch (error) {
        res.status(500).json({message: error.message});   
    }
}

exports.isReceiving = async (req, res) => {
    const{token, receiverId} = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id
        
        if (userId === receiverId){
            res.status(200).json({success: true})
        }
        else{
            res.status(400).json({success: false});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

