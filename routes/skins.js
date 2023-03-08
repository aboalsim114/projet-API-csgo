const express = require("express");
const skinModel = require("../model/skinModel.js")
const axios = require('axios');
const router = express.Router();
const jwt = require('jsonwebtoken');



// Middleware pour vérifier si l'utilisateur est connecté
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    } else {
        return res.status(401).json({ message: 'vous etes pas connecté' });
    }
}










router.get("/", isAuthenticated, async(req, res) => {

    let skins = await skinModel.find()
    res.status(200).json(skins)
})


// get skin by id
router.get('/:id', isAuthenticated, async(req, res) => {
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





// get skins by rarity
router.get('/rarity/:rarity', isAuthenticated, async(req, res) => {
    try {
        const skins = await skinModel.find({ rarity: req.params.rarity });
        if (skins.length === 0) {
            return res.status(404).json({
                message: "Aucune skin trouvée pour cette rareté"
            });
        }
        res.status(200).json(skins);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des skins"
        });
    }
});


// Route pour rechercher une skin par terme de recherche
router.get('/search/:term', isAuthenticated, async(req, res) => {
    try {
        // Récupérer le terme de recherche depuis les paramètres de la requête
        const term = req.params.term;

        // Rechercher les skins qui correspondent au terme de recherche
        const skins = await skinModel.find({ name: { $regex: term, $options: 'i' } });

        // Vérifier si des skins ont été trouvées
        if (skins.length === 0) {
            return res.status(404).json({ message: `Aucune skin trouvée pour le terme de recherche "${term}"` });
        }

        // Retourner les skins trouvées
        res.status(200).json(skins);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la recherche de skins.' });
    }
});


// Route pour récupérer les skins pour une équipe donnée
router.get('/teams/:team', isAuthenticated, async(req, res) => {
    try {
        const skins = await skinModel.find({ Team: req.params.team });
        if (skins.length === 0) {
            return res.status(404).json({
                message: "Aucune skin trouvée pour cette équipe"
            });
        }
        res.status(200).json(skins);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des skins"
        });
    }
});



router.get('/category/:category', isAuthenticated, async(req, res) => {
    try {
        const skins = await skinModel.find({ Category: req.params.category });
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






// mise a jour 
router.put('/:id', isAuthenticated, async(req, res, next) => {
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
router.delete('/:id', isAuthenticated, async(req, res) => {
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
router.post('/', isAuthenticated, (req, res, next) => {
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












module.exports = router;