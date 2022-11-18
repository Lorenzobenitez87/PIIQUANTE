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
const helmet = require("helmet")

const mongoSanitize = require('express-mongo-sanitize');
//const { application } = require("express");

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
//  Helmet helps to secure Express apps by setting various HTTP headers

app.use(helmet({
    crossOriginResourcePolicy: false,
  }));
  
//middleware which sanitizes user-supplied data to prevent MongoDB Operator Injection.
app.use(mongoSanitize());


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

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);


// Permet l'acces depuis les autres fichiers
module.exports = app;


