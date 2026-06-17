// script-etape.js - Affiche les détails d'une étape du Tour de France 2026
// Ne modifie pas script.js ni d'autres fichiers — fonctionnalité isolée

document.addEventListener('DOMContentLoaded', () => {
    // Récupérer l'ID de l'étape depuis l'URL (ex: etape.html?id=5)
    const urlParams = new URLSearchParams(window.location.search);
    const etapeId = urlParams.get('id');

    if (!etapeId || isNaN(etapeId) || etapeId < 1) {
        showError('Étape invalide.');
        return;
    }

    // Charger les données depuis detail-etapes.json
    fetch('detail-etapes.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Fichier detail-etapes.json non trouvé ou inaccessible');
            }
            return response.json();
        })
        .then(data => {
            // Trouver l'étape correspondante
            const etape = data.find(e => e.etape == etapeId);

            if (!etape) {
                showError('Étape non trouvée dans les données.');
                return;
            }

            // Remplir les placeholders
            document.getElementById('etape-num').textContent = etape.etape;
            document.getElementById('date').textContent = etape.date;
            document.getElementById('depart').textContent = etape.depart;
            document.getElementById('arrivee').textContent = etape.arrivee;
            document.getElementById('distance').textContent = etape.distance;
            document.getElementById('type').textContent = etape.type;

            // Cacher le message d'erreur s'il était affiché
            document.querySelector('.etape-error').style.display = 'none';
        })
        .catch(error => {
            console.error('Erreur lors du chargement des données :', error);
            showError('Impossible de charger les données des étapes. Vérifiez que detail-etapes.json est présent.');
        });

    // Fonction pour afficher un message d'erreur
    function showError(message) {
        const errorElement = document.querySelector('.etape-error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
});