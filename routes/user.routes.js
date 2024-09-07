const express = require('express');
const router = express.Router();
const {registerUser, login, getUserInfoByToken, checkEmail, checkUsername, updateLocation, sendOTP, addToFriendList, removeFromFriendList, getFriendList} = require('../controllers/user.controller');

router.post('/register', registerUser);
router.post('/login', login);
router.post('/checkUsername', checkUsername);
router.post('/checkEmail', checkEmail)
router.post('/sendOTP', sendOTP)
router.post('/addToFriendList', addToFriendList)

router.get('/getUserInfoByToken/:token', getUserInfoByToken);
router.get('/getFriendList', getFriendList)

// Updated route for updating location
router.put('/updateLocation', updateLocation);
router.put('/removeFromFriendList', removeFromFriendList);



module.exports = router;
