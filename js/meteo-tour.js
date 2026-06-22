// ============================================================
// 1. GEOCODING — Récupère les coordonnées d'une ville
// ============================================================
async function getCityCoordinates(cityName, countryCode = null) {
  // countryCode optionnel : "fr" pour France, "es" pour Espagne
  const country = countryCode ? `&countrycodes=${countryCode}` : "";
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1${country}`;

  const response = await fetch(url, {
    headers: { "Accept-Language": "fr" } // Résultats en français
  });
  const data = await response.json();

  if (!data || data.length === 0) {
    throw new Error(`Ville "${cityName}" introuvable`);
  }

  return {
    name: data[0].display_name.split(",")[0],
    latitude: parseFloat(data[0].lat),
    longitude: parseFloat(data[0].lon),
    country: data[0].display_name,
  };
}

// ============================================================
// 2. MÉTÉO — Récupère la météo à partir des coordonnées
// ============================================================
async function getWeather(latitude, longitude, date = null) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    wind_speed_unit: "kmh",
    timezone: "Europe/Paris",
  });
  

  if (date) {
    params.set("start_date", date);
    params.set("end_date", date);
    // ✅ Les deux en même temps
    params.set("daily", "temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max");
    params.set("hourly", "temperature_2m,wind_speed_10m,precipitation_probability,weather_code,relative_humidity_2m");
  } else {
    params.set("current", "temperature_2m,wind_speed_10m,precipitation,relative_humidity_2m,weather_code");
    params.set("hourly", "temperature_2m,wind_speed_10m,precipitation_probability,relative_humidity_2m");
    params.set("forecast_days", "1");
  }

  const url = `https://api.open-meteo.com/v1/forecast?${params}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Erreur météo : ${response.status}`);
  return await response.json();
}

// ============================================================
// 3. FONCTION PRINCIPALE — Enchaîne les deux appels API
// ============================================================
async function getWeatherForCity(cityName, date = null) {
  try {
    // console.log(`🔍 Recherche des coordonnées pour : ${cityName}`);
    const city = await getCityCoordinates(cityName);
    // console.log(`📍 Trouvé : ${city.name} (${city.latitude}, ${city.longitude})`);

    // console.log(`☁️  Récupération de la météo...`);
    const weather = await getWeather(city.latitude, city.longitude, date);

    const current = weather.current;
    // console.log(`\n🌡️  Météo actuelle à ${city.name} :`);
    // console.log(`   Température  : ${current.temperature_2m}°C`);
    // console.log(`   Vent         : ${current.wind_speed_10m} km/h`);
    // console.log(`   Précipitations: ${current.precipitation} mm`);
    // console.log(`   Humidité     : ${current.relative_humidity_2m}%`);

    return { city, weather };
  } catch (error) {
    console.error(`❌ Erreur : ${error.message}`);
    throw error;
  }
}

// ============================================================
// 4. EXEMPLE D'UTILISATION — Étapes du Tour de France
// ============================================================
const etapesTourDeFrance = [
  "Nice",
  "Lyon",
  "Bordeaux",
  "Toulouse",
  "Paris",
];

// Appel pour toutes les étapes
async function getAllStagesWeather(cities) {
  const results = [];
  for (const city of cities) {
    const data = await getWeatherForCity(city);
    results.push(data);
  }
  return results;
}

function getWeatherLabel(code) {
  const labels = {
    0:  "ENSOLEILLÉ",
    1:  "PRINCIPALEMENT DÉGAGÉ",
    2:  "PARTIELLEMENT NUAGEUX",
    3:  "COUVERT",
    45: "BROUILLARD",
    48: "BROUILLARD GIVRANT",
    51: "BRUINE LÉGÈRE",
    53: "BRUINE MODÉRÉE",
    55: "BRUINE DENSE",
    61: "PLUIE LÉGÈRE",
    63: "PLUIE MODÉRÉE",
    65: "PLUIE FORTE",
    71: "NEIGE LÉGÈRE",
    73: "NEIGE MODÉRÉE",
    75: "NEIGE FORTE",
    77: "GRAINS DE NEIGE",
    80: "AVERSES LÉGÈRES",
    81: "AVERSES MODÉRÉES",
    82: "AVERSES VIOLENTES",
    85: "AVERSES DE NEIGE",
    95: "ORAGEUX",
    96: "ORAGE AVEC GRÊLE",
    99: "ORAGE AVEC GRÊLE FORTE",
  };
  return labels[code] ?? "MÉTÉO INCONNUE";
}

function getWeatherSummary(weather) {
  const temps    = weather.hourly.temperature_2m;
  const winds    = weather.hourly.wind_speed_10m;
  const humidity = weather.hourly.relative_humidity_2m;
  const codes    = weather.hourly.weather_code;

  const avg = arr => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
  const hasDaily = !!weather.daily;

  return {
    tempMoyenne:  avg(temps),
    tempMax:      hasDaily ? weather.daily.temperature_2m_max[0] : Math.max(...temps),
    tempMin:      hasDaily ? weather.daily.temperature_2m_min[0] : Math.min(...temps),
    ventMoyen:    avg(winds),
    humidite:     avg(humidity),
    pluieTotale:  hasDaily ? weather.daily.precipitation_sum[0] : null,
    label:        getWeatherLabel(codes[12]), // ✅ code de midi
  };
}

// Décommenter pour lancer toutes les étapes :
// getAllStagesWeather(etapesTourDeFrance);

// Export pour usage en module (Node.js ou bundler)
export { getCityCoordinates, getWeather, getWeatherForCity, getAllStagesWeather, getWeatherSummary };


(async () => {
  const meteoStage = await getWeatherForCity("Valence", "2026-06-23");
})(); 