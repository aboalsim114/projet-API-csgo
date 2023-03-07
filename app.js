const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;
// Configuration de la connexion à la base de données MongoDB
mongoose.connect('mongodb://root:root@localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à la base de données réussie !'))
    .catch(() => console.log('Connexion à la base de données échouée.'));

// Configuration du middleware bodyParser pour la gestion des données JSON
app.use(bodyParser.json());

// Configuration des routes
const skinRoutes = require('./routes/skins');
app.use('/api/skins', skinRoutes);

const playerModel = require("./routes/players")
app.use("/api/players", playerModel)


app.get("/", (req, res) => {
    res.status(200).send("<h1>serveur en marche !!!</h1>")
})


app.listen(port, () => console.log(`connecter sur :  http://localhost:${port}`))