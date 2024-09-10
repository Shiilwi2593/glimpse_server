const express = require('express');
const router = express.Router()
const {sendFriendRequest, getFriendRequest, deleteFriendRequest} = require('../controllers/friendRequest.controller')

router.post('/sendFriendRequest', sendFriendRequest);
router.get('/getFriendRequest', getFriendRequest);
router.delete('/deleteFriendRequest', deleteFriendRequest);

module.exports = router;