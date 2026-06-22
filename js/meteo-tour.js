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
async function getWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: "temperature_2m,wind_speed_10m,precipitation,relative_humidity_2m,weather_code",
    hourly: "temperature_2m,wind_speed_10m,precipitation_probability",
    forecast_days: 1,
    wind_speed_unit: "kmh",
    timezone: "Europe/Paris",
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erreur météo : ${response.status}`);
  }

  return await response.json();
}

// ============================================================
// 3. FONCTION PRINCIPALE — Enchaîne les deux appels API
// ============================================================
async function getWeatherForCity(cityName) {
  try {
    // console.log(`🔍 Recherche des coordonnées pour : ${cityName}`);
    const city = await getCityCoordinates(cityName);
    // console.log(`📍 Trouvé : ${city.name} (${city.latitude}, ${city.longitude})`);

    // console.log(`☁️  Récupération de la météo...`);
    const weather = await getWeather(city.latitude, city.longitude);

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

// Décommenter pour lancer toutes les étapes :
// getAllStagesWeather(etapesTourDeFrance);

// Export pour usage en module (Node.js ou bundler)
export { getCityCoordinates, getWeather, getWeatherForCity, getAllStagesWeather };
 

// Option 2 : IIFE async (plus concis)
(async () => {
  const rslt = await getWeatherForCity("Nice");
  console.log(rslt.city.country); // ✅ fonctionne  
})(); 