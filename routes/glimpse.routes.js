const express = require('express');
const router = express.Router();
const { postGlimpse, getUserGlimpse, unlikeGlimpse, likeGlimpse, deleteGlimpse } = require('../controllers/glimpse.controller');


//POST
router.post('/postGlimpse', postGlimpse);

//GET
router.get('/getUserGlimpse', getUserGlimpse);

//PUT
router.put('/likeGlimpse', likeGlimpse);
router.put('/unlikeGlimpse', unlikeGlimpse);

//DELETE
router.delete('/deleteGlimpse', deleteGlimpse);

module.exports = router