const express = require('express');
const router = express.Router()
const {sendFriendRequest, getFriendRequest, deleteFriendRequest, isPending} = require('../controllers/friendRequest.controller')

router.post('/sendFriendRequest', sendFriendRequest);
router.get('/getFriendRequest', getFriendRequest);
router.post('/isPending', isPending);
router.delete('/deleteFriendRequest', deleteFriendRequest);

module.exports = router;