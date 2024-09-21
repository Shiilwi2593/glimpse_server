const express = require('express');
const router = express.Router()
const { sendFriendRequest, getFriendRequest, removeFriendRequestOnUsers, isReceiving, deleteFriendRequest, isPending } = require('../controllers/friendRequest.controller')

//POST
router.post('/sendFriendRequest', sendFriendRequest);
router.post('/isPending', isPending);
router.post('/isReceiving', isReceiving);

//GET
router.get('/getFriendRequest', getFriendRequest);

//DELETE
router.delete('/deleteFriendRequest', deleteFriendRequest);
router.delete('/removeFriendRequestOnUsers', removeFriendRequestOnUsers);

module.exports = router;