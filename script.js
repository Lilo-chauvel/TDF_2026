// JavaScript for Tour de France 2026 Memory Project
// This script is designed to be minimal and prepare for future evolution

// DOM Elements
const heroSection = document.querySelector('.hero');
const navigationLinks = document.querySelectorAll('a[href^="#"]');

// Smooth scrolling for navigation links
navigationLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Add animation to hero section on load
window.addEventListener('load', () => {
    setTimeout(() => {
        heroSection.style.opacity = '1';
    }, 300);
});

// Scroll animation for sections
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Observe all sections with class 'presentation', 'feature', 'vision', 'future'
const sections = document.querySelectorAll('.presentation, .feature, .vision, .future');
sections.forEach(section => {
    observer.observe(section);
});

// Data structure for future evolution - organized for easy externalization
const tourData = {
    edition: 113,
    year: 2026,
    startDate: "27 juin 2026",
    endDate: "19 juillet 2026",
    startLocation: "Barcelone",
    endLocation: "Paris",
    stages: 21,
    restDays: 2,
    stageTypes: [
        "plaine",
        "accidentées",
        "montagne",
        "contre-la-montre par équipes",
        "contre-la-montre individuel"
    ],
    features: [
        {
            title: "Cartes interactives",
            description: "Visualisation des parcours avec profils d'altitude et points clés"
        },
        {
            title: "Statistiques en temps réel",
            description: "Temps de passage, vitesses moyennes, dénivelés et comparaisons historiques"
        },
        {
            title: "Analyses tactiques",
            description: "Études des stratégies d'équipe et des moments décisifs des étapes"
        }
    ],
    vision: [
        {
            title: "Pour les fans de cyclisme",
            description: "Nous créons une ressource exhaustive pour les passionnés du Tour de France, offrant une compréhension profonde de chaque étape, des performances des coureurs et des dynamiques de course. Ce projet transforme la simple observation en analyse éditoriale de qualité."
        },
        {
            title: "Pour l'analyse sportive",
            description: "En combinant données techniques et observations qualitatives, nous développons une méthodologie d'analyse du cyclisme de haut niveau qui peut être appliquée à d'autres compétitions sportives."
        },
        {
            title: "Pour l'évolution",
            description: "Cette première version statique est conçue comme une base solide pour une application dynamique future, avec des fonctionnalités étendues comme les favoris, les notifications et l'intégration d'API de données."
        }
    ],
    futureEvolution: [
        "Architecture modulaire : Le code est organisé en composants réutilisables pour faciliter l'évolution vers une application React ou Vue.js",
        "Données structurées : Les informations sur les étapes sont organisées en format JSON prêt à être externalisé",
        "Design responsive : La page s'adapte parfaitement à tous les appareils, de la tablette au smartphone",
        "Préparation à l'API : La structure du code permet une intégration future avec des API de données du Tour de France",
        "Extensibilité : Les éléments de design et les composants sont conçus pour être facilement étendus avec des fonctionnalités comme les favoris, les filtres et les notifications"
    ]
};

// Placeholder for future API integration
// This structure is designed to be easily replaced with actual API calls in V2
async function fetchTourData() {
    // In V2, this would call an API
    // return await fetch('https://api.tourdefrance2026.com/data');
    return tourData;
}

// Initialize any components
function init() {
    console.log('Tour de France 2026 Memory Project - Static Landing Page Initialized');
}

// Run initialization
init();