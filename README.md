# Tour de France 2026 - Projet de Mémoire

Un projet statique pour présenter et suivre les étapes du Tour de France 2026 avec une interface moderne et une architecture bien organisée.

## Fonctionnalités

- Frise chronologique interactive des 21 étapes du Tour de France 2026
- Pages détaillées pour chaque étape avec informations sur le départ, l'arrivée, la distance et le type d'étape
- Données structurées en JSON pour une maintenance facile
- Design responsive compatible avec tous les appareils
- Architecture modulaire et bien organisée

## Structure du projet

```
/Tour-de-France-2026/
├── index.html # Page d'accueil avec la frise chronologique
├── styles.css # Feuille de style principale
├── js/
│ └── script-etape.js # Script pour afficher les détails des étapes
├── data/
│ └── detail-etapes.json # Données structurées des 21 étapes
├── pages/
│ └── etape.html # Page détaillée pour chaque étape
├── scripts/
│ └── fetch_etapes_json.py # Script Python pour générer les données des étapes
├── tests/
│ └── test-site.sh # Script de test pour vérifier le fonctionnement du site
├── assets/
│ ├── images/ # Images du projet
│ └── icons/ # Icônes du projet
└── README.md # Ce fichier
```

## Comment lancer le projet localement

1. Ouvrez le dossier du projet dans votre navigateur web
2. Accédez à `index.html` pour voir la frise chronologique
3. Cliquez sur n'importe quelle étape pour voir ses détails dans `pages/etape.html`

**Remarque :** Le site fonctionne en tant que site statique, donc aucun serveur web n'est nécessaire pour le visualiser localement. Il suffit d'ouvrir `index.html` dans un navigateur.

## Fonctionnement du routage JavaScript

Le système de routage utilisé dans ce projet est une architecture client-side simple mais efficace, basée sur une approche statique sans framework JavaScript complexe. Voici comment il fonctionne :

### 1. Structure des liens

Dans `index.html`, chaque étape est représentée par un lien HTML classique :

```html
<a href="pages/etape.html?id=1" class="etape-link">
  <div class="timeline-step">
    <div class="timeline-date">27 juin</div>
    <div class="timeline-label">Barcelone > Barcelone</div>
    <div class="timeline-distance">165 km</div>
  </div>
</a>
```

Chaque lien pointe vers `pages/etape.html` avec un paramètre d'URL (`?id=1`, `?id=2`, etc.) qui identifie l'étape à afficher.

### 2. Le template unique

Vous avez un seul fichier HTML `pages/etape.html` qui sert de template pour toutes les étapes. Ce fichier contient :

- Des placeholders HTML (éléments avec des IDs comme `#etape-num`, `#date`, etc.)
- Un script JavaScript qui se charge de remplir ces placeholders
- Une structure de base qui reste identique pour toutes les étapes

Cela permet d'éviter la duplication de code et facilite la maintenance.

### 3. Le routeur JavaScript

Le cœur du système réside dans `js/script-etape.js` :

```javascript
// 1. Attente du chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  // 2. Extraction de l'ID de l'étape depuis l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const etapeId = urlParams.get('id');
  
  // 3. Validation de l'ID
  if (!etapeId || isNaN(etapeId) || etapeId < 1) {
    showError('Étape invalide.');
    return;
  }
  
  // 4. Récupération des données externes
  fetch('../data/detail-etapes.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Fichier detail-etapes.json non trouvé ou inaccessible');
      }
      return response.json();
    })
    .then(data => {
      // 5. Recherche de l'étape correspondante
      const etape = data.find(e => e.etape == etapeId);
      
      if (!etape) {
        showError('Étape non trouvée dans les données.');
        return;
      }
      
      // 6. Mise à jour du DOM avec les données de l'étape
      document.getElementById('etape-num').textContent = etape.etape;
      document.getElementById('date').textContent = etape.date;
      document.getElementById('depart').textContent = etape.depart;
      document.getElementById('arrivee').textContent = etape.arrivee;
      document.getElementById('distance').textContent = etape.distance;
      document.getElementById('type').textContent = etape.type;
      
      // 7. Masquage du message d'erreur
      document.querySelector('.etape-error').style.display = 'none';
    })
    .catch(error => {
      console.error('Erreur lors du chargement des données :', error);
      showError('Impossible de charger les données des étapes. Vérifiez que detail-etapes.json est présent.');
    });
});
```

### 4. Les données

Le fichier `data/detail-etapes.json` contient toutes les informations sur les 21 étapes :

```json
[
  {
    "etape": "1",
    "date": "27/06/2026",
    "depart": "Barcelone",
    "arrivee": "Barcelone",
    "distance": "165 km",
    "type": "Plat"
  },
  {
    "etape": "2",
    "date": "28/06/2026",
    "depart": "Barcelone",
    "arrivee": "Lleida",
    "distance": "182 km",
    "type": "Plat"
  }
  // ... autres étapes
]
```

### Flux de navigation

Voici le processus complet lorsqu'un utilisateur clique sur une étape :

1. **Clic sur un lien** dans `index.html` → `pages/etape.html?id=5`
2. **Le navigateur charge** `pages/etape.html` (le template)
3. **Le script `script-etape.js` s'exécute** après le chargement du DOM
4. **Le script extrait** l'ID `5` de l'URL avec `URLSearchParams`
5. **Le script fait une requête HTTP** vers `data/detail-etapes.json`
6. **Le script trouve** l'étape correspondante dans le tableau JSON
7. **Le script met à jour** les éléments HTML avec les données de l'étape
8. **L'utilisateur voit** les détails de l'étape 5

### Avantages de cette architecture

- **Simplicité** : Pas besoin de frameworks complexes
- **Performance** : Chargement rapide, pas de compilation
- **Maintenabilité** : Ajouter une nouvelle étape = ajouter une entrée dans le JSON + un lien dans l'HTML
- **Sécurité** : Pas de risque d'injection XSS (pas de templating dynamique)
- **Compatibilité** : Fonctionne sur tous les navigateurs modernes
- **SEO** : Les liens sont des URLs normales (pas de hash routing)

## Technologies utilisées

- HTML5
- CSS3
- JavaScript (ES6+)
- JSON pour les données
- Python 3 (pour le script de génération de données)

## Contribuer

Si vous souhaitez contribuer à ce projet :

1. Fork le dépôt
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/votre-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajoute votre fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/votre-fonctionnalite`)
5. Ouvrez une pull request

## License

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus d'informations.