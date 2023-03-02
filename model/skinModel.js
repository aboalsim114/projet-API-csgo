const mongoose = require('mongoose');

const skinSchema = mongoose.Schema({
    name: { type: String, required: true },
    rarity: { type: String, required: true },
    Team: { type: String, required: true },
    Category: { type: String, required: true },
    prices: [{
        platform: { type: String, required: true },
        price: { type: Number, required: true }
    }]
});

const Skin = mongoose.model('Skin', skinSchema);

module.exports = Skin;