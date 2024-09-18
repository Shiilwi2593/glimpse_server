const mongoose = require('mongoose');

const GlimpseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    image:{
        type: String,
        require: true
    },
    location:{
        latitude: {type: Number},
        longitude: {type: Number},
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Glimpse', GlimpseSchema);