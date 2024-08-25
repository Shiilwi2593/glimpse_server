const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, required: true, unique:true},
    password: {type: String, required: true, unique: true},
    friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    location:{
        latitude:{type: Number},
        longitude:{type: Number},
        updateAt: {type: Date}
    },
    createAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: Date.now}      
})

module.exports = mongoose.model('User', UserSchema)