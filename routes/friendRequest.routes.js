const express = require('express');
const router = express.Router()
const { sendFriendRequest, getFriendRequest,getRequestId, removeFriendRequestOnUsers, isReceiving, deleteFriendRequest, isPending } = require('../controllers/friendRequest.controller')

//POST
router.post('/sendFriendRequest', sendFriendRequest);
router.post('/isPending', isPending);
router.post('/isReceiving', isReceiving);

//GET
router.get('/getFriendRequest', getFriendRequest);
router.post('/getRequestId', getRequestId);

//DELETE
router.delete('/deleteFriendRequest', deleteFriendRequest);
router.delete('/removeFriendRequestOnUsers', removeFriendRequestOnUsers);

module.exports = router;