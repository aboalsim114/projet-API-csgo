const express = require('express');
const axios = require('axios');
const Player = require('../model/playerModel');
const router = express.Router();






// Middleware pour vérifier si l'utilisateur est connecté
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    } else {
        return res.status(401).json({ message: 'vous etes pas connecté' });
    }
}







// Récupérer tous les joueurs
router.get('/', isAuthenticated, async(req, res) => {
    try {
        const players = await Player.find();
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des joueurs' });
    }
});

// Récupérer un joueur par son id
router.get('/:id', isAuthenticated, async(req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        if (!player) {
            return res.status(404).json({ message: 'Joueur non trouvé' });
        }
        res.status(200).json(player);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du joueur' });
    }
});

// Créer un joueur
router.post('/', isAuthenticated, async(req, res) => {
    const player = new Player({
        fullname: req.body.fullname,
        nickname: req.body.nickname,
        country: {
            name: req.body.country.name,
            flag: req.body.country.flag,
        },
    });

    try {
        const savedPlayer = await player.save();
        res.status(201).json({ msg: "player ajouté avec success", savedPlayer });
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création du joueur', error: error });
    }
});

// Mettre à jour un joueur
router.put('/:id', isAuthenticated, async(req, res) => {
    try {
        const updatedPlayer = await Player.findByIdAndUpdate(
            req.params.id, {
                fullname: req.body.fullname,
                nickname: req.body.nickname,
                country: {
                    name: req.body.country.name,
                    flag: req.body.country.flag,
                },
            }, { new: true }
        );
        if (!updatedPlayer) {
            return res.status(404).json({ message: 'Joueur non trouvé' });
        }
        res.status(200).json(updatedPlayer);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du joueur' });
    }
});

// Supprimer un joueur
router.delete('/:id', isAuthenticated, async(req, res) => {
    try {
        const deletedPlayer = await Player.findByIdAndDelete(req.params.id);
        if (!deletedPlayer) {
            return res.status(404).json({ message: 'Joueur non trouvé' });
        }
        res.status(200).json({ message: 'Joueur supprimé avec succès', deletedPlayer: deletedPlayer });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du joueur' });
    }
});





// Route pour récupérer les joueurs ayant un nom complet contenant un terme de recherche
router.get('/search/:term', isAuthenticated, async(req, res) => {
    try {
        // Récupérer le terme de recherche depuis les paramètres de la requête
        const term = req.params.term;

        // Rechercher les joueurs qui correspondent au terme de recherche
        const players = await Player.find({ fullname: { $regex: term, $options: 'i' } });

        // Vérifier si des joueurs ont été trouvés
        if (players.length === 0) {
            return res.status(404).json({ message: `Aucun joueur trouvé pour le terme de recherche "${term}"` });
        }

        // Retourner les joueurs trouvés
        res.status(200).json(players);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la recherche de joueurs.' });
    }
});




module.exports = router;