const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { error } = require('console');
const { json } = require('express');
const streamifier = require('streamifier');



exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        //Check email exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'Email already exists' })
        }

        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }

        //Create user
        user = new User({
            username,
            email,
            password
        })

        //Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        res.status(201).json({ success: true, message: 'User registered successfully' });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ success: false, message: 'Server error occurred' });
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'user not exists' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'wrong password' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        // Tạo token không có thời hạn hết hạn
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


exports.getUserInfoByToken = async (req, res) => {
    const token = req.params.token;

    if (!token) {
        return res.status(401).json({ msg: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id;

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.getUserInfoById = async (req, res) => {
    const { id } = req.query

    if (!id) {
        return res.status(401).json({ msg: "No id provided" });
    }
    try {
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: "user not found" });
        }
        res.status(200).json(user)

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.getUserInfoByUsernameOrEmail = async (req, res) => {
    const { keyword } = req.query;

    if (!keyword) {
        return res.status(401).json({ msg: "No keyword provided" });
    }

    try {
        const regex = new RegExp(keyword, 'i');

        const users = await User.find({
            $or: [
                { username: { $regex: regex } },
                { email: { $regex: regex } }
            ]
        });

        if (users.length === 0) {
            return res.status(404).json({ msg: "No users found" });
        }

        res.status(200).json({ users });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


exports.checkEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(200).json({ exists: true, msg: 'Email already exists' })
        } else {
            return res.status(200).json({ exists: false, msg: 'Email is available' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



exports.checkUsername = async (req, res) => {
    const { username } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user) {
            return res.status(200).json({ exists: true, msg: 'Username already exists' })
        } else {
            return res.status(200).json({ exists: false, msg: 'Username is available' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// user.controller.js

exports.updateLocation = async (req, res) => {
    const { token, latitude, longitude } = req.body;
    try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id;

        // Update user location
        const user = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    'location.latitude': latitude,
                    'location.longitude': longitude,
                    'location.updateAt': new Date()
                }
            },
            { new: true } // Return the updated user
        ).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'Location updated successfully', user });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.fetchFriendsLocation = async (req, res) => {
    const { token } = req.query;

    try {
        // Giải mã token để lấy ID người dùng
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id;

        // Tìm người dùng và lấy danh sách bạn bè cùng với thông tin vị trí
        const user = await User.findById(userId).populate({
            path: 'friends',
            select: '_id location.latitude location.longitude location.updateAt username image' // Thêm username và image vào select
        });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const friendsLocation = user.friends.map(friend => ({
            _id: friend._id,
            latitude: friend.location.latitude,
            longitude: friend.location.longitude,
            updateAt: friend.location.updateAt,
            username: friend.username,
            image: friend.image 
        }));

        res.status(200).json({ friends: friendsLocation });

    } catch (error) {
        console.error('Error fetching friends location:', error);
        res.status(500).json({ message: error.message });
    }
};



exports.sendOTP = async (req, res) => {
    const { email } = req.body; // Địa chỉ email của người nhận

    if (!email) {
        return res.status(400).json({ success: false, message: 'No email provided' });
    }

    try {
        const otp = crypto.randomInt(100000, 999999); // OTP 6 chữ số

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER, // Địa chỉ email của bạn
            to: email, // Địa chỉ email người nhận
            subject: 'Glimpse OTP',
            text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, otp }); // Gửi OTP về client
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
};

exports.addToFriendList = async (req, res) => {
    const { id1, id2 } = req.body
    try {
        const user1 = await User.findById(id1)
        const user2 = await User.findById(id2)

        //add to my list
        user1.friends.push(user2)
        await user1.save();
        user2.friends.push(user1)
        await user2.save();


        res.status(200).json({ success: true, message: 'Friend added' });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.removeFromFriendList = async (req, res) => {
    const { token, friendId } = req.body;

    try {
        //Get userid from token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userID = decoded.user.id;

        const user = await User.findById(userID);
        const friend = await User.findById(friendId);


        //remove fr from my account
        user.friends.pop(friendId);
        await user.save();

        //remove my acc from friend list
        friend.friends.pop(userID);
        await friend.save();

        res.status(200).json({ success: true, message: 'Friend removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getFriendList = async (req, res) => {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userID = decoded.user.id;

        const user = await User.findById(userID).populate('friends', '_id username email image');

        res.status(200).json({ friends: user.friends });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getOrtherFriendList = async (req, res) => {
    const { id } = req.query

    try {
        const user = await User.findById(id).populate('friends', '_id username email image');
        res.status(200).json({ friends: user.friends });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.isFriend = async (req, res) => {
    const { token, friendId } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.user.id;

        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ msg: 'user not found' });
        }

        const isFriend = user.friends.includes(friendId);
        res.status(200).json({ isFriend })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.isMe = async (req, res) => {
    const { token, id } = req.body;
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id;

        if (userId === id) {
            return res.status(200).json({success: true});
        } else {
            return res.status(401).json({success: false});
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.updateImage = async (req, res) => {
    const { token, imageUrl } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id;
        console.log('User ID from token:', userId);

        // Find and update the user
        const user = await User.findByIdAndUpdate(
            userId, 
            { $set: { image: imageUrl, updatedAt: Date.now() } }, 
            { new: true, runValidators: true }
        );

        if (!user) {
            console.log('No user found with ID:', userId);
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error updating image:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
