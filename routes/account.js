const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const User = require('../model/userModel');




// Ajouter le middleware body-parser pour récupérer les données du corps de la requête
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


// Route pour l'inscription d'un utilisateur
router.post('/register', async(req, res) => {
    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
        }

        // Crypter le mot de passe avant de l'enregistrer dans la base de données
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Créer un nouvel utilisateur
        const user = new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        // Enregistrer l'utilisateur dans la base de données
        const savedUser = await user.save();

        // Générer un jeton d'authentification
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);

        res.status(201).json({ msg: "user crée avec success", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'utilisateur.' });
    }
});

// Login route
router.post('/login', async(req, res) => {
    const { username, password } = req.body;

    // Check if the username and password are present
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find the user with the given username
    const user = await User.findOne({ username });

    // Check if the user was found
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Set the session user ID
    req.session.userId = user._id;

    // Return the user object
    res.json({ msg: "vous etes connecté", user });
});


// Route pour récupérer les informations de l'utilisateur actuellement connecté
router.get('/me', async(req, res) => {
    try {
        // Récupérer l'utilisateur actuellement connecté à partir du jeton d'authentification
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des informations utilisateur.' });
    }
});




router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
        }
        res.clearCookie(process.env.SESSION_NAME);
        res.status(200).json({ message: 'Déconnexion réussie' });
    });
});






module.exports = router;