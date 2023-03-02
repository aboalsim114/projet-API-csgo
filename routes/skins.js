const express = require("express");
const skinModel = require("../model/skinModel.js")
const axios = require('axios');
const router = express.Router();



// get all skins 
router.get("/", async(req, res) => {
    let skins = await skinModel.find();
    return res.status(200).json(skins)
})



// get skin by id
router.get('/:id', async(req, res) => {
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




// mise a jour 
router.put('/:id', async(req, res, next) => {
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
router.delete('/:id', async(req, res) => {
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
router.post('/', (req, res, next) => {
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