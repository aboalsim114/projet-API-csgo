const express = require("express");
const skinModel = require("../model/skinModel.js")
const axios = require('axios');
const router = express.Router();
const jwt = require('jsonwebtoken');






// Middleware pour la validation du token
function authenticateToken(req, res, next) {
    // Récupère le token d'accès dans l'en-tête Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Vérifie si le token existe
    if (token == null) return res.status(401).json({ message: 'Token non fourni' });

    // Vérifie si le token est valide
    jwt.verify(token, 'abc1234', (err, user) => {
        if (err) return res.status(403).json({ message: 'Token invalide' });
        req.user = user;
        next();
    });
}


// Route pour la génération de token
router.post('/login', (req, res) => {
    // Vérifie si l'utilisateur est autorisé à se connecter
    if (req.body.username === 'user' && req.body.password === 'password') {
        // Génère un token d'accès avec une durée de validité de 1 heure
        const token = jwt.sign({ username: req.body.username }, 'abc1234', { expiresIn: '1h' });
        res.json({ token: token });
    } else {
        res.status(401).json({ message: 'Identifiants invalides' });
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
                image: req.body.image,
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
        image: req.body.image,
        prices: req.body.prices
    });
    skin.save()
        .then(result => {
            res.status(200).json({
                message: 'Skin créé avec succès !',
                createdSkin: {
                    name: result.name,
                    rarity: result.rarity,
                    image: result.image,
                    prices: result.prices
                }
            });
        })
        .catch(error => {
            next(error);
        });
});




module.exports = router;