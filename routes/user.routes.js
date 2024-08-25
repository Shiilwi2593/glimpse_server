const express = require('express');
const router = express.Router();
const {registerUser, login, getUserInfoByToken, checkEmail, checkUsername, updateLocation} = require('../controllers/user.controller');

router.post('/register', registerUser);
router.post('/login', login);
router.post('/checkUsername', checkUsername);
router.post('/checkEmail', checkEmail)
router.get('/getUserInfoByToken', getUserInfoByToken);

// Updated route for updating location
router.put('/updateLocation', updateLocation);



module.exports = router;
