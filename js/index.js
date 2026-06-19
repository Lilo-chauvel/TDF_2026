// ==========================================================
// INDEX - Génération dynamique de la liste des étapes
// ==========================================================

// Petit raccourci pour récupérer un élément HTML via son id
function $(id) {
  return document.getElementById(id);
}

// Charge le fichier JSON qui contient toutes les étapes
async function loadStages() {
  try {
    const response = await fetch("./data/detail-etapes.json");

    // Si le fichier n'est pas trouvé ou erreur serveur
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    // Transforme la réponse JSON en tableau JavaScript
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors du chargement des étapes :", error);
    return [];
  }
}

// Retourne la classe CSS du tag selon le type d'étape
function getTagClass(type) {
  const value = type.toLowerCase();

  if (value.includes("plaine")) return "plaine";
  if (value.includes("haute")) return "haute";
  if (value.includes("montagne")) return "montagne";
  if (value.includes("clm") || value.includes("contre") || value.includes("équipe")) return "clm";
  return "plaine";
}

// Retourne le nombre de points remplis pour les petits dots
// C'est purement visuel
function getDifficultyDots(type) {
  const value = type.toLowerCase();

  if (value.includes("plaine")) return 2;
  if (value.includes("haute")) return 5;
  if (value.includes("montagne")) return 4;
  if (value.includes("clm") || value.includes("contre") || value.includes("équipe")) return 3;
  return 2;
}

// Crée le HTML des dots
function createDots(count) {
  let dotsHtml = "";

  for (let i = 1; i <= 5; i++) {
    dotsHtml += `<span class="dot ${i <= count ? "filled" : ""}"></span>`;
  }

  return dotsHtml;
}

// Crée une carte d'étape normale
function createStageCard(stage) {
  const link = document.createElement("a");
  link.href = `./etape.html?id=${stage.etape}`;

  const card = document.createElement("div");
  card.className = "stage-card";

  const tagClass = getTagClass(stage.type);
  const dotsCount = getDifficultyDots(stage.type);

  card.innerHTML = `
    <div class="stage-top">
      <span>Étape ${stage.etape}</span>
      <span class="date">${stage.date}</span>
    </div>

    <div class="stage-route">${stage.depart} → ${stage.arrivee}</div>

    <div class="stage-bottom">
      <span>${stage.distance}</span>

      <div class="stage-meta">
        <span class="dots">
          ${createDots(dotsCount)}
        </span>
        <span class="tag ${tagClass}">${stage.type}</span>
      </div>
    </div>
  `;

  link.appendChild(card);
  return link;
}

// Crée une carte "repos"
function createRestCard(stage) {
  const card = document.createElement("div");
  card.className = "stage-card is-rest";

  card.innerHTML = `
    <div class="stage-top">
      <span>Repos</span>
      <span class="date">${stage.date}</span>
    </div>

    <div class="stage-route">Journée de récupération</div>

    <div class="stage-bottom">
      <span>—</span>
      <div class="stage-meta">
        <span class="tag repos">Repos</span>
      </div>
    </div>
  `;

  return card;
}

// Affiche toutes les étapes dans la grille
function renderStages(stages) {
  const grid = $("stage-grid");
  if (!grid) return;

  grid.innerHTML = "";

  stages.forEach((stage) => {
    // Si ton JSON contient un type "Repos", on affiche une carte spéciale
    if (stage.type && stage.type.toLowerCase() === "repos") {
      grid.appendChild(createRestCard(stage));
      return;
    }

    grid.appendChild(createStageCard(stage));
  });
}

// Fonction principale
async function initStagesPage() {
  const stages = await loadStages();

  if (!stages.length) {
    console.warn("Aucune étape trouvée dans detail-etapes.json");
    return;
  }

  renderStages(stages);
}

// On lance le script quand le HTML est prêt
document.addEventListener("DOMContentLoaded", initStagesPage);