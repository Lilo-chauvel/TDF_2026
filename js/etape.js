document.addEventListener('DOMContentLoaded', () => {

  function $(id) {
    return document.getElementById(id);
  }

  function getStageIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id") || "1";
  }

  async function loadEtapesData() {
    try {
      const response = await fetch("./data/detail-etapes.json");
      if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Impossible de charger les étapes :", error);
      return [];
    }
  }

  function getTypeShort(type) {
    const v = type.toLowerCase();
    if (v.includes("plat")) return "Plat";
    if (v.includes("montagne")) return "Mont.";
    if (v.includes("accidentée")) return "Accid.";
    if (v.includes("clm") || v.includes("c.l.m")) return "CLM";
    return type;
  }

  function getTypeClass(type) {
    const v = type.toLowerCase();
    if (v.includes("plat")) return "plaine";
    if (v.includes("montagne")) return "montagne";
    if (v.includes("accidentée")) return "haute";
    if (v.includes("clm") || v.includes("c.l.m")) return "clm";
    return "plaine";
  }

  function renderStageNav(etapesData, currentId) {
    const nav = $("stages-nav");
    if (!nav) return;
    nav.innerHTML = "";
    etapesData.forEach((stage) => {
      const link = document.createElement("a");
      link.href = `etape.html?id=${stage.etape}`;
      link.className = "stage-item";
      link.textContent = stage.etape;
      if (stage.etape === currentId) link.classList.add("active");
      nav.appendChild(link);
    });
  }

  function fillStagePage(stage) {
    document.title = `Étape ${stage.etape} - ${stage.depart} → ${stage.arrivee}`;

    $("stage-number-top").textContent = `Étape ${stage.etape}`;
    $("stage-date-top").textContent = stage.date;
    $("stage-depart-title").textContent = stage.depart;
    $("stage-arrivee-title").textContent = stage.arrivee;

    const typeBadge = $("stage-type-badge");
    typeBadge.textContent = stage.type;
    typeBadge.className = `stage-type ${getTypeClass(stage.type)}`;

    $("stage-distance").textContent = stage.distance;
    $("stage-denivele").textContent = stage["dénivelé"];
    $("stage-type-short").textContent = getTypeShort(stage.type);

    const profileImage = $("stage-profile-image");
    if (profileImage) {
      profileImage.src = `/assets/etapes/${stage.etape}.png`;
      profileImage.alt = `Profil de l'étape ${stage.etape}`;
    }

    $("stage-depart-legend").textContent = stage.depart.toUpperCase();
    $("stage-distance-legend").textContent = stage.distance.toUpperCase();
    $("stage-arrivee-legend").textContent = stage.arrivee.toUpperCase();

    $("info-type").textContent = stage.type.toUpperCase();
    $("info-distance").textContent = stage.distance.toUpperCase();
    $("info-denivele").textContent = stage["dénivelé"].toUpperCase();
    $("info-depart").textContent = stage.depart.toUpperCase();
    $("info-arrivee").textContent = stage.arrivee.toUpperCase();
    $("info-date").textContent = stage.date;
    $("info-etape").textContent = stage.etape;

    // Météo : champs absents du JSON pour l'instant, on masque la section
    if (stage.meteo) {
      $("weather-temp").textContent = stage.meteo.temp;
      $("weather-label").textContent = stage.meteo.label.toUpperCase();
      $("weather-wind").textContent = stage.meteo.vent;
      $("weather-humidity").textContent = stage.meteo.humidite;
      $("weather-min").textContent = stage.meteo.min;
    }

    // Sections optionnelles (absentes du JSON de base)
    if (stage.pointsCles) renderPointsCles(stage.pointsCles);
    if (stage.favoris) renderFavoris(stage.favoris);
    if (stage.analyse) renderAnalyse(stage.analyse);
  }

  function renderPointsCles(points) {
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

  function renderFavoris(favoris) {
    const container = $("favorites-grid");
    if (!container) return;
    container.innerHTML = "";
    favoris.forEach((favori, index) => {
      const card = document.createElement("div");
      card.className = "favorite-card";
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

  function renderAnalyse(analyse) {
    const container = $("analysis-text");
    if (!container) return;
    container.innerHTML = "";
    analyse.forEach((paragraph) => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      container.appendChild(p);
    });
  }

  async function initStagePage() {
    const stageId = getStageIdFromUrl(); // string, ex: "3"
    const etapesData = await loadEtapesData();

    if (!etapesData.length) {
      document.body.innerHTML = `<div class="error">Aucune donnée d'étape disponible.</div>`;
      return;
    }

    // "etape" dans le JSON est une string ("1", "2"...), on compare directement
    const stage = etapesData.find((item) => item.etape === stageId) || etapesData[0];

    fillStagePage(stage);
    renderStageNav(etapesData, stage.etape);
  }

  initStagePage();
});