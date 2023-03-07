const express = require('express');
const axios = require('axios');
const Player = require('../model/playerModel');
const router = express.Router();
const authenticateToken = require('./auth');






// Route pour la génération de token
router.post('/login', (req, res) => {
    // Vérifie si l'utilisateur est autorisé à se connecter
    if (req.body.username && req.body.password) {
        // Génère un token d'accès avec une durée de validité de 1 heure
        const token = jwt.sign({ username: req.body.username }, 'abc1234', { expiresIn: '1h' });
        res.json({ token: token });
    } else {
        res.status(401).json({ message: 'Identifiants invalides' });
    }
});




// Récupérer tous les joueurs
router.get('/', authenticateToken, async(req, res) => {
    try {
        const players = await Player.find();
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des joueurs' });
    }
});

// Récupérer un joueur par son id
router.get('/:id', authenticateToken, async(req, res) => {
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
router.post('/', authenticateToken, async(req, res) => {
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
router.put('/:id', authenticateToken, async(req, res) => {
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
router.delete('/:id', authenticateToken, async(req, res) => {
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

module.exports = router;