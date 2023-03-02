const mongoose = require('mongoose');

const skinSchema = mongoose.Schema({
    name: { type: String, required: true },
    rarity: { type: String, required: true },
    image: { type: String, required: true },
    prices: [{
        platform: { type: String, required: true },
        price: { type: Number, required: true }
    }]
});

const Skin = mongoose.model('Skin', skinSchema);

module.exports = Skin;