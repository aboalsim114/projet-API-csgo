# Projet de gestion de skins CSGO

Ce projet est une API permettant de gérer une collection de skins pour le jeu Counter-Strike: Global Offensive (CSGO). L'API permet de créer, lire, mettre à jour et supprimer des skins, ainsi que de les filtrer par catégorie.

## Prérequis

Pour exécuter l'API, vous devez installer les éléments suivants :

- Node.js (v14.17.6 ou plus récent)
- MongoDB (v5.0.3 ou plus récent)

## Installation

1. Clonez ce dépôt de code sur votre machine locale
2. Dans le terminal, naviguez vers le répertoire racine du projet
3. Exécutez npm install pour installer les dépendances
4. Exécutez npm start pour lancer l'API sur http://localhost:3000

## Utilisation

L'API peut être utilisée en effectuant des requêtes HTTP sur les routes exposées. Il est recommandé d'utiliser un client HTTP comme Postman pour tester les différentes routes.

# skins

- ` GET /api/skins` : renvoie toutes les skins
- `GET /api/skins/:id` : renvoie la skin correspondant à l'ID donné
- `GET /api/skins/category/:category` : renvoie toutes les skins correspondant à la catégorie donnée
- `GET /api/skins/:name` : renvoie la skin correspondant au nom donné
- ` PUT /api/skins/:id` : met à jour la skin correspondant à l'ID donné
- `DELETE /api/skins/:id` : supprime la skin correspondant à l'ID donné
- `POST /api/skins` : crée une nouvelle skin

---

# Players

- ` GET /api/players` : récupère tous les joueurs
- ` GET /api/players/id` : récupère un joueur par son ID
- ` POST /api/players` : crée un joueur
- ` PUT /api/players/id` : met à jour un joueur par son ID
- ` DELETE  /api/players/id` : supprime un joueur par son ID

# Recherche

- ` GET /api/skins/search/:term` : rechercher des skins en fonction d'un terme de recherche

# Authentification

- ` POST /account/login` : connecte un utilisateur
- ` POST /account/register` : enregistre un nouvel utilisateur
- ` POST /account/register` : déconnecte un utilisateur

## Contributing

- [abdulhalim sami](https://www.linkedin.com/in/sami-abdulhalim/)
