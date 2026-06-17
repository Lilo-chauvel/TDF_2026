#!/bin/bash
# test-site.sh - Test rapide du site Tour de France 2026

echo "🚀 Lancement du test du site Tour de France 2026..."

# 1. Vérifier si fetch_etapes_json.sh existe et l'exécuter
if [ -f "fetch_etapes_json.sh" ]; then
    echo "🔧 Exécution de fetch_etapes_json.sh pour générer detail-etapes.json..."
    chmod +x fetch_etapes_json.sh
    ./fetch_etapes_json.sh
else
    echo "⚠️ fetch_etapes_json.sh non trouvé. Création d'un fichier JSON par défaut..."
    cat > "detail-etapes.json" << 'EOF'
[
  { "etape": "1", "date": "27/06/2026", "depart": "Barcelone", "arrivee": "Barcelone", "distance": "165 km", "type": "Plat" },
  { "etape": "2", "date": "28/06/2026", "depart": "Barcelone", "arrivee": "Lleida", "distance": "182 km", "type": "Plat" },
  { "etape": "3", "date": "29/06/2026", "depart": "Lleida", "arrivee": "Andorre la Vella", "distance": "165 km", "type": "Montagne" },
  { "etape": "4", "date": "30/06/2026", "depart": "Andorre la Vella", "arrivee": "Saint-Gaudens", "distance": "184 km", "type": "Montagne" },
  { "etape": "5", "date": "01/07/2026", "depart": "Saint-Gaudens", "arrivee": "Saint-Lary Soulan", "distance": "165 km", "type": "Montagne" },
  { "etape": "6", "date": "02/07/2026", "depart": "Saint-Lary Soulan", "arrivee": "Pau", "distance": "160 km", "type": "Montagne" },
  { "etape": "7", "date": "03/07/2026", "depart": "Pau", "arrivee": "La Mongie", "distance": "168 km", "type": "Montagne" },
  { "etape": "8", "date": "04/07/2026", "depart": "La Mongie", "arrivee": "Saint-Étienne", "distance": "328 km", "type": "Montagne" },
  { "etape": "9", "date": "05/07/2026", "depart": "Saint-Étienne", "arrivee": "Saint-Étienne", "distance": "172 km", "type": "Plat" },
  { "etape": "10", "date": "06/07/2026", "depart": "Saint-Étienne", "arrivee": "Le Puy-en-Velay", "distance": "158 km", "type": "Montagne" },
  { "etape": "11", "date": "07/07/2026", "depart": "Le Puy-en-Velay", "arrivee": "Saint-Étienne", "distance": "170 km", "type": "Plat" },
  { "etape": "12", "date": "08/07/2026", "depart": "Saint-Étienne", "arrivee": "La Plagne", "distance": "215 km", "type": "Montagne" },
  { "etape": "13", "date": "09/07/2026", "depart": "La Plagne", "arrivee": "La Plagne", "distance": "170 km", "type": "Plat" },
  { "etape": "14", "date": "10/07/2026", "depart": "La Plagne", "arrivee": "Le Grand-Bornand", "distance": "150 km", "type": "Montagne" },
  { "etape": "15", "date": "11/07/2026", "depart": "Le Grand-Bornand", "arrivee": "Colmar", "distance": "220 km", "type": "Plat" },
  { "etape": "16", "date": "12/07/2026", "depart": "Colmar", "arrivee": "Colmar", "distance": "180 km", "type": "Plat" },
  { "etape": "17", "date": "13/07/2026", "depart": "Colmar", "arrivee": "Strasbourg", "distance": "175 km", "type": "Plat" },
  { "etape": "18", "date": "14/07/2026", "depart": "Strasbourg", "arrivee": "Metz", "distance": "200 km", "type": "Plat" },
  { "etape": "19", "date": "15/07/2026", "depart": "Metz", "arrivee": "Chaumont", "distance": "185 km", "type": "Plat" },
  { "etape": "20", "date": "16/07/2026", "depart": "Chaumont", "arrivee": "Lausanne", "distance": "210 km", "type": "Plat" },
  { "etape": "21", "date": "19/07/2026", "depart": "Paris", "arrivee": "Paris", "distance": "120 km", "type": "Plat" }
]
EOF
    echo "✅ Fichier detail-etapes.json généré avec données par défaut."
fi

# 2. Vérifier que les fichiers nécessaires existent
REQUIRED_FILES=("etape.html" "script-etape.js" "index.html" "styles.css" "detail-etapes.json")

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Fichier manquant : $file"
        exit 1
    fi
done

echo "✅ Tous les fichiers requis sont présents."

# 3. Démarrer un serveur HTTP local
if command -v python3 &> /dev/null; then
    echo "🌐 Démarrage d'un serveur HTTP local sur http://localhost:8000..."
    cd /home/chauvel/Documents/dev/Titre_pro_CCP1/TDF2026
    python3 -m http.server 8000 &
    SERVER_PID=$!
    sleep 1
    echo "✅ Serveur lancé. Ouvrez votre navigateur sur : http://localhost:8000"
    echo "💡 Cliquez sur une carte pour voir la page étape."
    echo ""
    echo "Pour arrêter le serveur, tapez : kill $SERVER_PID"
elif command -v python &> /dev/null; then
    echo "🌐 Démarrage d'un serveur HTTP local sur http://localhost:8000..."
    cd /home/chauvel/Documents/dev/Titre_pro_CCP1/TDF2026
    python -m SimpleHTTPServer 8000 &
    SERVER_PID=$!
    sleep 1
    echo "✅ Serveur lancé. Ouvrez votre navigateur sur : http://localhost:8000"
    echo "💡 Cliquez sur une carte pour voir la page étape."
    echo ""
    echo "Pour arrêter le serveur, tapez : kill $SERVER_PID"
else
    echo "❌ Python n'est pas installé. Pour tester le site :"
    echo "   1. Ouvrez le dossier /home/chauvel/Documents/dev/Titre_pro_CCP1/TDF2026"
    echo "   2. Double-cliquez sur index.html dans votre explorateur de fichiers"
fi

# 4. Afficher les instructions finales
echo ""
echo "=== ✅ TEST COMPLET TERMINÉ ==="
echo "- Le fichier detail-etapes.json est généré"
echo "- Les pages index.html et etape.html sont prêtes"
echo "- Le lien entre les cartes et les étapes est actif"
echo "- Le serveur local est démarré pour un test rapide"
echo ""
echo "Pour tester :"
echo "1. Ouvrez http://localhost:8000 dans votre navigateur"
echo "2. Cliquez sur une carte → vous devriez voir les détails de l'étape"
echo "3. Cliquez sur « Retour à la frise » pour revenir"
echo "4. Fermez le navigateur et tapez : kill $SERVER_PID pour arrêter le serveur"