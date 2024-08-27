const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');



exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        //Check email exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'Email already exists' })
        }

        user = await User.findOne({username});
        if(user){
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

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.status(200).json({ token })
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.getUserInfoByToken = async (req, res) => {
    const { token } = req.body;
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



exports.checkUsername = async(req, res) => {
    const {username} = req.body;
    try{
        const user = await User.findOne({username});
        if (user) {
            return res.status(200).json({ exists: true, msg: 'Username already exists' })
        } else {
            return res.status(200).json({ exists: false, msg: 'Username is available' });
        }
    }catch(error){
        res.status(500).json({message: error.message});
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
