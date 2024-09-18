const express = require('express');
const router = express.Router();
const {postGlimpse, getUserGlimpse, unlikeGlimpse,likeGlimpse, deleteGlimpse} = require('../controllers/glimpse.controller');


router.post('/postGlimpse', postGlimpse);

router.get('/getUserGlimpse', getUserGlimpse);

router.put('/likeGlimpse', likeGlimpse);

router.put('/unlikeGlimpse', unlikeGlimpse);

router.delete('/deleteGlimpse', deleteGlimpse);
module.exports = router