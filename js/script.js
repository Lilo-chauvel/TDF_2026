// ==========================================================
// PAGE ETAPE - VERSION DYNAMIQUE
// Ce script :
// 1) lit l'id de l'étape dans l'URL
// 2) charge le fichier JSON
// 3) trouve la bonne étape
// 4) remplit le HTML automatiquement
// ==========================================================

// Petite fonction utilitaire : récupère un élément HTML via son id
function $(id) {
    return document.getElementById(id);
}

// 1) Lire l'étape demandée dans l'URL
// Exemple : etape.html?id=3  -> on récupère "3"
function getStageIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    console.log(`numéro d'étape : ${params.get("id")}`);
    return params.get("id") || "1";
}

// 2) Charger le JSON depuis un fichier externe
// fetch() récupère le fichier
// response.json() transforme la réponse en objet JavaScript
async function loadEtapesData() {
    try {
        const response = await fetch("/data/etapes.json");

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const data = await response.json();
        console.log(Json);
        console.log(response.json());
        return data;
    } catch (error) {
        console.error("Impossible de charger les étapes :", error);
        return [];
    }
}

// 3) Convertir le type long en version courte pour le bloc de stats
function getTypeShort(type) {
    const value = type.toLowerCase();

    if (value.includes("plaine")) return "Plaine";
    if (value.includes("haute")) return "Haute";
    if (value.includes("montagne")) return "Mont.";
    if (value.includes("clm") || value.includes("contre") || value.includes("équipe")) return "CLM";

    return type;
}

// 4) Ajouter une classe CSS selon le type d'étape
// Ça permet de changer la couleur du badge si tu veux
function getTypeClass(type) {
    const value = type.toLowerCase();

    if (value.includes("plaine")) return "plaine";
    if (value.includes("haute")) return "haute";
    if (value.includes("montagne")) return "montagne";
    if (value.includes("clm") || value.includes("contre") || value.includes("équipe")) return "clm";

    return "plaine";
}

// 5) Générer la nav horizontale des étapes
function renderStageNav(etapesData, currentStageId) {
    const nav = $("stages-nav");
    if (!nav) return;

    nav.innerHTML = "";

    etapesData.forEach((stage) => {
        const link = document.createElement("a");
        link.href = `etape.html?id=${stage.etape}`;
        link.className = "stage-item";
        link.textContent = stage.etape;

        if (stage.etape === currentStageId) {
            link.classList.add("active");
        }

        nav.appendChild(link);
    });
}

// 6) Afficher les points clés
function renderPointsCles(points = []) {
    const container = $("key-points-list");
    if (!container) return;

    container.innerHTML = "";

    points.forEach((point) => {
        const row = document.createElement("div");
        row.className = "point-row";

        row.innerHTML = `
      <div class="point-left">
        <span class="km">${point.km}</span>
        <p>${point.label}</p>
      </div>
      <img src="${point.icon}" alt="${point.iconAlt}" class="icon-link ${point.iconClass}">
    `;

        container.appendChild(row);
    });
}

// 7) Afficher les favoris
function renderFavoris(favoris = []) {
    const container = $("favorites-grid");
    if (!container) return;

    container.innerHTML = "";

    favoris.forEach((favori, index) => {
        const card = document.createElement("div");
        card.className = "favorite-card";

        // Le premier favori a un style spécial
        const rankClass = index === 0 ? "rank-chip" : "rank-number";

        card.innerHTML = `
      <div class="rider-badge">${favori.initials}</div>
      <h3>${favori.nom}</h3>
      <p>${favori.equipe}</p>
      <div class="${rankClass}">${favori.rang}</div>
    `;

        container.appendChild(card);
    });
}

// 8) Afficher l'analyse tactique
function renderAnalyse(analyse = []) {
    const container = $("analysis-text");
    if (!container) return;

    container.innerHTML = "";

    analyse.forEach((paragraph) => {
        const p = document.createElement("p");
        p.textContent = paragraph;
        container.appendChild(p);
    });
}

// 9) Remplir toute la page avec les données d'une étape
function fillStagePage(stage) {
    console.log("Étape chargée :", stage.etape);
    // Titre de l'onglet navigateur
    document.title = `Étape ${stage.etape} - ${stage.depart} → ${stage.arrivee}`;

    // Haut de page
    $("stage-number-top").textContent = `Étape ${stage.etape}`;
    $("stage-date-top").textContent = stage.date;
    $("stage-depart-title").textContent = stage.depart;
    $("stage-arrivee-title").textContent = stage.arrivee;

    // Badge type
    const typeBadge = $("stage-type-badge");
    typeBadge.textContent = stage.type;
    typeBadge.className = `stage-type ${getTypeClass(stage.type)}`;

    // Stats hero
    $("stage-distance").textContent = stage.distance;
    $("stage-denivele").textContent = stage["dénivelé"];
    $("stage-type-short").textContent = getTypeShort(stage.type);

    // ===== IMAGE / GRAPHIQUE PROFIL =====
    // Ici on construit automatiquement le chemin :
    // /asserts/etapes/1.png
    // /asserts/etapes/2.png
    // etc.
    const profileImage = $("stage-profile-image");
    if (profileImage) {
        profileImage.src = `/asserts/etapes/${stage.etape}.png`;
        profileImage.alt = `Profil de l'étape ${stage.etape}`;
    }

    // Légendes sous le profil
    $("stage-depart-legend").textContent = stage.depart.toUpperCase();
    $("stage-distance-legend").textContent = stage.distance.toUpperCase();
    $("stage-arrivee-legend").textContent = stage.arrivee.toUpperCase();

    // Bloc infos à droite
    $("info-type").textContent = stage.type.toUpperCase();
    $("info-distance").textContent = stage.distance.toUpperCase();
    $("info-denivele").textContent = stage["dénivelé"].toUpperCase();
    $("info-depart").textContent = stage.depart.toUpperCase();
    $("info-arrivee").textContent = stage.arrivee.toUpperCase();
    $("info-date").textContent = stage.date;
    $("info-etape").textContent = stage.etape;

    // Bloc météo
    if (stage.meteo) {
        $("weather-temp").textContent = stage.meteo.temp;
        $("weather-label").textContent = stage.meteo.label.toUpperCase();
        $("weather-wind").textContent = stage.meteo.vent;
        $("weather-humidity").textContent = stage.meteo.humidite;
        $("weather-min").textContent = stage.meteo.min;
    }

    // Sections dynamiques
    renderPointsCles(stage.pointsCles);
    renderFavoris(stage.favoris);
    renderAnalyse(stage.analyse);
}

// 10) Fonction principale
async function initStagePage() {
    // numéro demandé dans l'URL
    const stageId = getStageIdFromUrl();

    // chargement du JSON
    const etapesData = await loadEtapesData();

    // sécurité si aucune donnée
    if (!etapesData.length) {
        console.error("Aucune donnée d'étape trouvée.");
        return;
    }

    // on cherche l'étape qui correspond à l'id
    const stage = etapesData.find((item) => item.etape === stageId) || etapesData[0];

    // on remplit la page
    fillStagePage(stage);

    // on génère la navigation horizontale
    renderStageNav(etapesData, stage.etape);
}

// 11) On lance le script quand le HTML est prêt
document.addEventListener("DOMContentLoaded", initStagePage);