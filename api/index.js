const express = require('express');
const session = require('express-session');
const {Pool} = require('pg');
const bcrypt = require('bcrypt');
const path = require('path');


const app = express();
const port = 3000;

// Configuration de la session
app.use(session({
    secret: 'votre_secret_key',
    resave: false,
    saveUninitialized: true,
}));

// Configuration de la connexion à la base de données
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'venteVoitures',
    password: 'Epsilon94',
    port: 5432,
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Page d'accueil
app.get('/', (req, res) => {
    res.send('Bienvenue sur le site d\'achat de voitures en ligne!');
});

// Inscription
app.post('/inscription', async (req, res) => {
    const {nom, prenom, email, motDePasse} = req.body;

    try {
        // Insérer l'utilisateur dans la base de données
        const result = await pool.query(
            'INSERT INTO Users (nom, prenom, email, mot_de_passe) VALUES ($1, $2, $3, $4) RETURNING *',
            [nom, prenom, email, motDePasse]
        );

        const user = result.rows[0];

        // Connecter automatiquement l'utilisateur après l'inscription
        req.session.userID = user.userID;

        res.status(200).redirect("http://localhost:63342/Site%20web%20A%20a%20Z%2014-02-22/client/form.html?_ijt=165p0or180f1d9ff5eq7iud3pb&_ij_reload=RELOAD_ON_SAVE");
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).send(`Erreur lors de l\'inscription : ${error.message}`);
    }
});

// Authentification
app.post('/connexion', async (req, res) => {
    const {email, motDePasse} = req.body;

    try {
        // Vérifier les informations d'authentification
        const result = await pool.query(
            `SELECT *
             FROM Users
             WHERE email = $1`,
            [email]
        );

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const match = await (motDePasse === user.mot_de_passe);
            //console.log(user.mot_de_passe)
            //console.log(match)

            if (match) {
                // Connecter l'utilisateur
                req.session.userID = user.userID;

                // Renvoyer une réponse JSON indiquant la réussite de la connexion
                res.status(200).redirect("http://localhost:63342/Site%20web%20A%20a%20Z%2014-02-22/client/index.html?_ijt=j3c4cgv4o1o7n9ca9r2jk7bbv6&_ij_reload=RELOAD_ON_SAVE")
                return;
            }
        }

        // Renvoyer une réponse JSON indiquant l'échec de la connexion
        res.status(401).json({success: false, message: 'Identifiants incorrects'});
    } catch (error) {
        console.error('Erreur lors de l\'authentification:', error);
        res.status(500).send(`Erreur lors de l\'authentification : ${error.message}`);
    }
});


// Déconnexion
app.get('/deconnexion', (req, res) => {
    // Déconnecter l'utilisateur en supprimant la session
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erreur lors de la déconnexion');
        } else {
            res.status(200).send('Déconnexion réussie');
            res.redirect("http://localhost:63342/Site%20web%20A%20a%20Z%2014-02-22/client/form.html?_ijt=l8rj3dogmc4eiv54f05f7o22qd&_ij_reload=RELOAD_ON_SAVE");
        }
    });
});

// Passage de commande et ajout à la base de données
app.post('/passer-commande', async (req, res) => {

    console.log("Le boutton a bien été cliqué")
    try {
        // Insérer la commande dans la base de données
        const result = await pool.query(
            'INSERT INTO orders (date_commande, user_id) VALUES (CURRENT_DATE, $1) RETURNING *',
            [req.session.userID]
        );

        const commande = result.rows[0];

        res.status(200).json({success: true, commande});
    } catch (error) {
        console.error('Erreur lors du passage de commande:', error);
        res.status(500).json({success: false, message: error.message});
    }
});

app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});
