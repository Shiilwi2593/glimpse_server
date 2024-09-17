const express = require('express');
const router = express.Router();
const multer = require('multer');

const {registerUser,updateImage, login, getUserInfoById, getUserInfoByToken, fetchFriendsLocation, getUserInfoByUsernameOrEmail, getOrtherFriendList, checkEmail, checkUsername, updateLocation, sendOTP, addToFriendList, removeFromFriendList, getFriendList, isFriend, isMe } = require('../controllers/user.controller');

router.post('/register', registerUser);
router.post('/login', login);
router.post('/checkUsername', checkUsername);
router.post('/checkEmail', checkEmail);
router.post('/sendOTP', sendOTP);
router.post('/addToFriendList', addToFriendList);
router.post('/isFriend', isFriend);
router.post('/isMe', isMe);


router.get('/getUserInfoByToken/:token', getUserInfoByToken);
router.get('/getFriendList', getFriendList);
router.get('/getOrtherFriendList', getOrtherFriendList);
router.get('/getUserInfoById', getUserInfoById);
router.get('/getUserInfoByUsernameOrEmail', getUserInfoByUsernameOrEmail);
router.get('/fetchFriendsLocation', fetchFriendsLocation);

// Updated route for updating location
router.put('/updateLocation', updateLocation);
router.put('/removeFromFriendList', removeFromFriendList);
router.put('/updateImage', updateImage)

module.exports = router;
