const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
    fullname: { type: String, required: true },
    nickname: { type: String },
    country: [{
        name: { type: String, required: true },
        flag: { type: String, required: true }
    }]

});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;