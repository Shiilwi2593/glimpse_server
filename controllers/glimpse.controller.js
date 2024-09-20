const Glimpse = require('../models/glimpse.model')

const { error } = require('console');
const { json } = require('express');

exports.postGlimpse = async (req, res) => {
    const {userId ,image, latitude, longitude} = req.body
    try {
        const newGlimpse = new Glimpse({
            userId,
            image,
            location: {
                latitude,
                longitude
            }
        });

        await newGlimpse.save();
        res.status(200).json(newGlimpse);
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}



exports.getUserGlimpse = async(req, res) => {
    const {id} = req.query;
    try {
        const glimpse = await Glimpse.find({
            userId: id
        });

        if(!glimpse){
            return res.status(404).json({ message: 'Glimpse not found' });
        }
        res.status(200).json(glimpse);

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


exports.likeGlimpse = async (req, res) => {
    const {glimpseId, userId} = req.body
    try {
        const glimpse = await Glimpse.findById(glimpseId)
        if (!glimpse){
            res.status(404).json({message: 'Glimpse not found'});
        }
        glimpse.likes.push(userId);
        res.status(200).json({glimpse});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.unlikeGlimpse = async (req, res) => {
    const {glimpseId, userId} = req.body
    try {
        const glimpse = await Glimpse.findById(glimpseId)
        if (!glimpse){
            res.status(404).json({message: 'Glimpse not found'});
        }
        glimpse.likes.pop(userId);
        res.status(200).json({glimpse});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.deleteGlimpse = async(req, res) => {
    const {glimpseId} = req.query
    try {
        const glimpse = await Glimpse.findByIdAndDelete(glimpseId)
        if(!glimpse){
            res.status(404).json({message: 'Glimpse not found'});
        }
        res.status(200).json({success: true, glimpse});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

