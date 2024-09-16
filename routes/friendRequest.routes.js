const express = require('express');
const router = express.Router()
const {sendFriendRequest, getFriendRequest,removeFriendRequestOnUsers, isReceiving, deleteFriendRequest, isPending} = require('../controllers/friendRequest.controller')

router.post('/sendFriendRequest', sendFriendRequest);
router.get('/getFriendRequest', getFriendRequest);
router.post('/isPending', isPending);
router.post('/isReceiving', isReceiving)
router.delete('/deleteFriendRequest', deleteFriendRequest);
router.delete('/removeFriendRequestOnUsers', removeFriendRequestOnUsers); 


module.exports = router;