// Code JavaScript côté client
document.getElementById('votreFormulaireDeConnexion').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const motDePasse = document.getElementById('motDePasse').value;

    const response = await fetch('/connexion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, motDePasse}),
    });

    const result = await response.json();

    if (result.success) {
        // Connexion réussie, recharger la page
        location.reload();
    } else {
        // Afficher un message d'erreur, par exemple
        alert(result.message);
    }
});


// Sélectionner la balise a par son identifiant
const endpointLink = document.getElementById('endpointLink');

// Ajouter un gestionnaire d'événement pour ajouter pour contacter le endpoint
endpointLink.addEventListener('click', async (event) => {
    event.preventDefault();

    const response = await fetch('/passer-commande');

    const result = await response.json();

    if (result.success) {
        // Connexion réussie, recharger la page
        location.reload();
    } else {
        // Afficher un message d'erreur, par exemple
        alert(result.message);
    }
});
