


// On appel le framework express
require("dotenv").config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

// On appel mongoose 
const mongoose = require('mongoose');

const saucesRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user');
const { application } = require("express");

str_connect = 'mongodb+srv://' +
    process.env.BDD_LOGIN
    + ':' +
    process.env.BDD_MDP
    + '@' +
    process.env.BDD_URL
    + '/' +
    process.env.BDD_NAME +
    '?retryWrites=true&w=majority';

mongoose.connect(str_connect,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((e) => console.log('Connexion à MongoDB échouée !', e));

// Express prend toutes les requêtes qui ont comme Content-Type application/json et met à disposition leur body directement sur l'objet req
app.use(express.json());

// Ces headers permettent: 
// - d'accéder à notre API depuis n'importe quelle origine ( '*' ) ;
// - d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) ;
// - d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('images', express.static(path.join(__dirname, 'images')));


app.get('/api/sauces', (req, res, next) => {
    const sauces = [
        {
            _id: 'oeihfzeoi',
            userId: 'qsomihvqios',
            name: 'nom de la sauce',
            manufacturer: 'fabricant de la sauce',
            description: 'Les infos de mon premier objet',
            mainPepper: 'le principal ingrédient épicé de la sauce',
            imageUrl: 'l URL de l image de la sauce téléchargée par l utilisateur',
            heat: 'nombre entre 1 et 10 decrivant la sauce',
            likes: 'nombre d utilisateurs qui aiment la sauce',
            dislikes: 'nombre d utilisateurs qui n aiment pas la sauce',
            usersLiked: 'tableau des identifiants des utilisateurs qui ont aimé la sauce',
            usersDisliked: 'tableau des identifiants des utilisateurs qui n ont pas aimé la sauce',
        },
        {
            _id: 'oeihfzeomoihi',
            userId: 'qsomihvqios',
            name: 'nom de la sauce 2',
            manufacturer: 'fabricant de la sauce',
            description: 'Les infos de mon deuxième objet',
            mainPepper: 'le principal ingrédient épicé de la sauce',
            imageUrl: 'l URL de l image de la sauce téléchargée par l utilisateur',
            heat: 'nombre entre 1 et 10 decrivant la sauce',
            likes: 'nombre d utilisateurs qui aiment la sauce',
            dislikes: 'nombre d utilisateurs qui n aiment pas la sauce',
            usersLiked: 'tableau des identifiants des utilisateurs qui ont aimé la sauce',
            usersDisliked: 'tableau des identifiants des utilisateurs qui n ont pas aimé la sauce',
        },
    ];
    res.status(200).json(sauces);
});

// Permet l'acces depuis les autres fichiers
module.exports = app;


