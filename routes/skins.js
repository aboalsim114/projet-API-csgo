const express = require("express");
const skinModel = require("../model/skinModel.js")
const axios = require('axios');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authenticateToken = require('./auth');








// Route pour la génération de token
router.post('/login', (req, res) => {
    // Validate input
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Generate access token with 1 hour expiration
        const token = jwt.sign({ username: req.body.username }, 'abc1234', { expiresIn: '1h' });
        res.json({ token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating token' });
    }
});



router.get("/", authenticateToken, async(req, res) => {

    let skins = await skinModel.find()
    res.status(200).json(skins)
})


// get skin by id
router.get('/:id', authenticateToken, async(req, res) => {
    try {
        const skin = await skinModel.findById(req.params.id);
        if (!skin) {
            return res.status(404).json({
                message: "Skin non trouvée"
            });
        }
        res.status(200).json(skin);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération de la skin"
        });
    }
});


// get skin by name 
router.get('/:name', authenticateToken, async(req, res) => {
    try {
        const skin = await skinModel.findOne({ name: req.params.name });
        if (!skin) {
            return res.status(404).json({
                message: "Skin non trouvée"
            });
        }
        res.status(200).json(skin);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération de la skin"
        });
    }
});





// mise a jour 
router.put('/:id', authenticateToken, async(req, res, next) => {
    try {
        const updatedSkin = await skinModel.findByIdAndUpdate(
            req.params.id, {
                name: req.body.name,
                rarity: req.body.rarity,
                Team: req.body.Team,
                prices: req.body.prices
            }, { new: true }
        );
        if (!updatedSkin) {
            return res.status(404).json({
                message: "Skin non trouvée"
            });
        }
        res.status(200).json({
            message: "Skin mise à jour avec succès",
            updatedSkin: updatedSkin
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la mise à jour de la skin"
        });
    }
});






// supprimer un skin
router.delete('/:id', authenticateToken, async(req, res) => {
    try {
        const deletedSkin = await skinModel.findByIdAndDelete(req.params.id);
        if (!deletedSkin) {
            return res.status(404).json({
                message: "Skin non trouvée"
            });
        }
        res.status(200).json({
            message: "Skin supprimée avec succès",
            deletedSkin: deletedSkin
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la suppression de la skin"
        });
    }
});





// post skin 
router.post('/', authenticateToken, (req, res, next) => {
    const skin = new skinModel({
        name: req.body.name,
        rarity: req.body.rarity,
        Team: req.body.Team,
        Category: req.body.Category,
        prices: req.body.prices
    });
    skin.save()
        .then(result => {
            res.status(200).json({
                message: 'Skin créé avec succès !',
                createdSkin: {
                    name: result.name,
                    rarity: result.rarity,
                    Team: result.Team,
                    Category: req.body.Category,
                    prices: result.prices
                }
            });
        })
        .catch(error => {
            next(error);
        });
});




router.get('/category/:category', authenticateToken, async(req, res) => {
    try {
        const skins = await skinModel.find({ category: req.params.category });
        if (skins.length === 0) {
            return res.status(404).json({
                message: "Aucune skin trouvée pour cette catégorie"
            });
        }
        res.status(200).json(skins);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des skins"
        });
    }
});





module.exports = router;