# IntegralTech Frontend

Bienvenue sur le dépôt du projet Frontend d'**IntegralTech**, le site vitrine moderne, performant et animé pour l'entreprise de solutions IT et de transformation numérique.

## 📖 Présentation du projet
Ce projet est une Single Page Application (SPA) ultra-rapide développée avec React et Vite. L'objectif est de présenter les services, solutions et l'expertise d'IntegralTech tout en offrant une expérience utilisateur premium grâce à des micro-interactions fluides et des animations GSAP avancées.

## ✨ Fonctionnalités
- **UI/UX Premium** : Design soigné avec un thème sombre (Dark/Orange) distinctif.
- **Animations fluides (GSAP)** : Entrées, survols, scroll-triggered (défilement).
- **Entièrement Responsive** : Expérience optimisée sur mobile, tablette et desktop.
- **Menu dynamique** : Megamenu fonctionnel pour les sections "Solutions" et "Services" avec des animations Framer Motion.
- **Barre de recherche rapide** : Navigation intuitive depuis la Navbar.
- **Optimisé pour le SEO** : Balises Meta, OpenGraph, sitemap.xml, robots.txt.
- **Haute Performance** : Lazy loading, format WebP, bundle optimisé via Vite.

## 🛠 Stack Technique
- **React 19** : Bibliothèque frontend principale.
- **TypeScript** : Typage statique robuste.
- **Vite** : Bundler ultra-rapide.
- **GSAP & Framer Motion** : Bibliothèques d'animations.
- **React Router DOM** : Gestion de la navigation côté client.
- **Lucide React** : Collection d'icônes SVG légères.
- **Vanilla CSS** : Mise en page et style via `globals.css` et styles inline performants.

## 🚀 Installation & Lancement

1. **Cloner le projet**
```bash
git clone https://github.com/IntegralTech/integraltech-frontend.git
cd integraltech-frontend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancement du serveur de développement**
```bash
npm run dev
```

4. **Lancement du Typecheck et Build (Production)**
```bash
npm run typecheck
npm run build
```

## 📁 Structure des dossiers (Aperçu)
- `/src` : Code source principal de l'application.
- `/src/components` : Composants réutilisables (Home, Layout, Contact, etc.).
- `/src/pages` : Pages principales associées aux routes (Home, About, Services...).
- `/src/styles` : Styles globaux (globals.css).
- `/public` : Assets statiques (images WebP, robots.txt, sitemap.xml).
- `/docs` : Documentation technique détaillée.

Pour plus de détails, consultez [docs/project-structure.md](./docs/project-structure.md).

## 📚 Documentation Technique
Consultez le dossier `/docs/` pour une documentation approfondie :
- [Architecture globale](./docs/architecture.md)
- [Structure du projet](./docs/project-structure.md)
- [Composants React](./docs/components.md)
- [Navigation (Routing) & Menu](./docs/routing.md)
- [Animations GSAP](./docs/animations.md)
- [Stratégie SEO](./docs/seo.md)
- [Optimisation de Performance](./docs/performance.md)
- [Guide de Déploiement](./docs/deployment.md)
- [Guide de Contribution](./docs/contributing.md)

## 📄 Licence
Ce projet est propriétaire. Tous droits réservés à IntegralTech © 2026.
