const jwt = require('jsonwebtoken');

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

module.exports = authenticateToken;