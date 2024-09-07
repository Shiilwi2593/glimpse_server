const express = require('express');
const router = express.Router()
const {sendFriendRequest, getFriendRequest} = require('../controllers/friendRequest.controller')

router.post('/sendFriendRequest', sendFriendRequest);
router.get('/getFriendRequest', getFriendRequest);

module.exports = router;