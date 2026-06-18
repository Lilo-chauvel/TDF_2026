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
    fetch('../data/detail-etapes.json')
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

            // Remplir les placeholders de base
            document.getElementById('etape-num').textContent = etape.etape;
            document.getElementById('date').textContent = etape.date;
            document.getElementById('depart').textContent = etape.depart;
            document.getElementById('arrivee').textContent = etape.arrivee;
            document.getElementById('distance').textContent = etape.distance;
            document.getElementById('type').textContent = etape.type;

            // Afficher les informations du vainqueur
            const winnerSection = document.createElement('div');
            winnerSection.className = 'winner-section';
            winnerSection.innerHTML = `
                <h3>Vainqueur de l'étape</h3>
                <div class="winner-info">
                    <span class="winner-name">${etape.winner.name}</span>
                    <span class="winner-team">${etape.winner.team}</span>
                    <span class="winner-time">${etape.winner.time}</span>
                </div>
            `;
            document.querySelector('.etape-detail').insertBefore(winnerSection, document.querySelector('.etape-info'));

            // Afficher le podium
            const podiumSection = document.createElement('div');
            podiumSection.className = 'podium-section';
            podiumSection.innerHTML = `
                <h3>Podium</h3>
                <div class="podium">
                    ${etape.podium.map((finisher, index) => `
                        <div class="podium-item podium-${index + 1}">
                            <span class="podium-position">${index + 1}</span>
                            <span class="podium-name">${finisher.name}</span>
                            <span class="podium-team">${finisher.team}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            document.querySelector('.etape-detail').insertBefore(podiumSection, document.querySelector('.etape-stats'));

            // Afficher les classifications
            const classificationSection = document.createElement('div');
            classificationSection.className = 'classification-section';
            classificationSection.innerHTML = `
                <h3>Classifications</h3>
                <div class="classifications">
                    <div class="classification-item">
                        <span class="classification-label">Maillot jaune</span>
                        <span class="classification-value">${etape.classification.general.leader} (${etape.classification.general.team})</span>
                    </div>
                    <div class="classification-item">
                        <span class="classification-label">Maillot vert</span>
                        <span class="classification-value">${etape.classification.points.leader} (${etape.classification.points.points} pts)</span>
                    </div>
                    <div class="classification-item">
                        <span class="classification-label">Maillot à pois</span>
                        <span class="classification-value">${etape.classification.mountains.leader} (${etape.classification.mountains.points} pts)</span>
                    </div>
                    <div class="classification-item">
                        <span class="classification-label">Maillot blanc</span>
                        <span class="classification-value">${etape.classification.young_rider.leader} (${etape.classification.young_rider.time})</span>
                    </div>
                </div>
            `;
            document.querySelector('.etape-detail').insertBefore(classificationSection, document.querySelector('.etape-error'));

            // Afficher le profil de l'étape
            const profileSection = document.createElement('div');
            profileSection.className = 'profile-section';
            profileSection.innerHTML = `
                <h3>Profil de l'étape</h3>
                <div class="profile-info">
                    <div class="profile-item">
                        <span class="profile-label">Dénivelé positif</span>
                        <span class="profile-value">${etape.profile.elevation_gain} m</span>
                    </div>
                    <div class="profile-item">
                        <span class="profile-label">Type</span>
                        <span class="profile-value">${etape.profile.type}</span>
                    </div>
                    <div class="profile-item">
                        <span class="profile-label">Climbs</span>
                        <span class="profile-value">${etape.profile.climbs.length} catégorisées</span>
                    </div>
                </div>
            `;
            document.querySelector('.etape-detail').insertBefore(profileSection, document.querySelector('.etape-error'));

            // Afficher les conditions météo
            const weatherSection = document.createElement('div');
            weatherSection.className = 'weather-section';
            weatherSection.innerHTML = `
                <h3>Conditions météo</h3>
                <div class="weather-info">
                    <div class="weather-item">
                        <span class="weather-label">Condition</span>
                        <span class="weather-value">${etape.weather.condition}</span>
                    </div>
                    <div class="weather-item">
                        <span class="weather-label">Température</span>
                        <span class="weather-value">${etape.weather.temperature}°C</span>
                    </div>
                    <div class="weather-item">
                        <span class="weather-label">Vent</span>
                        <span class="weather-value">${etape.weather.wind}</span>
                    </div>
                </div>
            `;
            document.querySelector('.etape-detail').insertBefore(weatherSection, document.querySelector('.etape-error'));

            // Afficher les statistiques supplémentaires
            const statsSection = document.querySelector('.etape-stats');
            statsSection.innerHTML += `
                <p><strong>Vitesse moyenne :</strong> <span id="average-speed">${etape.average_speed} km/h</span></p>
                <p><strong>Écart avec le 2ème :</strong> <span id="time-gap">${etape.time_gap}</span></p>
                <p><strong>Départ :</strong> <span id="start-time">${etape.start_time}</span></p>
                <p><strong>Arrivée :</strong> <span id="finish-time">${etape.finish_time}</span></p>
            `;

            // Afficher les détails des cols
            if (etape.profile.climbs.length > 0) {
                const climbsSection = document.createElement('div');
                climbsSection.className = 'climbs-section';
                climbsSection.innerHTML = `
                    <h3>Cols de l'étape</h3>
                    <div class="climbs-list">
                        ${etape.profile.climbs.map(climb => `
                            <div class="climb-item">
                                <span class="climb-name">${climb.name}</span>
                                <span class="climb-category">${climb.category}</span>
                                <span class="climb-distance">${climb.distance} km</span>
                                <span class="climb-gradient">${climb.gradient}%</span>
                                <span class="climb-length">${climb.length} km</span>
                            </div>
                        `).join('')}
                    </div>
                `;
                document.querySelector('.etape-detail').insertBefore(climbsSection, document.querySelector('.etape-error'));
            }

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