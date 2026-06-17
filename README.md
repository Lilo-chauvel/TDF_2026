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
├── index.html               # Page d'accueil avec la frise chronologique
├── styles.css               # Feuille de style principale
├── js/
│   └── script-etape.js      # Script pour afficher les détails des étapes
├── data/
│   └── detail-etapes.json   # Données structurées des 21 étapes
├── pages/
│   └── etape.html           # Page détaillée pour chaque étape
├── scripts/
│   └── fetch_etapes_json.py # Script Python pour générer les données des étapes
├── tests/
│   └── test-site.sh         # Script de test pour vérifier le fonctionnement du site
├── assets/
│   ├── images/              # Images du projet
│   └── icons/               # Icônes du projet
└── README.md                # Ce fichier
```

## Comment lancer le projet localement

1. Ouvrez le dossier du projet dans votre navigateur web
2. Accédez à `index.html` pour voir la frise chronologique
3. Cliquez sur n'importe quelle étape pour voir ses détails dans `pages/etape.html`

**Remarque :** Le site fonctionne en tant que site statique, donc aucun serveur web n'est nécessaire pour le visualiser localement. Il suffit d'ouvrir `index.html` dans un navigateur.

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