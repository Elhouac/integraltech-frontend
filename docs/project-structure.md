# Structure du Projet

L'organisation des fichiers suit le principe de la modularité, ce qui facilite la maintenance et le repérage au fur et à mesure que le projet grandit.

## 📂 Arborescence Principale

```
integraltech-frontend/
├── docs/                   # Documentation technique (fichiers .md)
├── public/                 # Assets statiques publics (Sitemap, Robots.txt, favicon)
│   ├── logo.png
│   ├── hero-bg.webp
│   ├── robots.txt
│   └── sitemap.xml
├── src/                    # Code source de l'application
│   ├── assets/             # Fichiers médias statiques importés via JS (fonts, icons, images)
│   ├── components/         # Blocs visuels réutilisables
│   │   ├── contact/        # Composants liés à la page Contact
│   │   ├── home/           # Sections spécifiques à la page d'accueil
│   │   ├── layout/         # Éléments d'interface globaux (Navbar, Footer, TopBar)
│   │   └── mockups/        # Composants de démonstration ou iframes (si existants)
│   ├── hooks/              # Custom Hooks React (ex: animations GSAP réutilisables)
│   ├── pages/              # Pages complètes (vues principales routées)
│   ├── routes/             # Configuration optionnelle des routes
│   ├── styles/             # Fichiers CSS globaux (globals.css)
│   ├── App.tsx             # Composant racine définissant le Layout
│   ├── constants.ts        # Fichier de constantes métier (couleurs, clés)
│   ├── main.tsx            # Point d'entrée de React (rendu DOM)
│   └── vite-env.d.ts       # Déclarations TypeScript pour Vite
├── index.html              # Fichier HTML racine avec les métadonnées SEO
├── package.json            # Dépendances et scripts npm
├── tsconfig.json           # Configuration TypeScript
└── vite.config.ts          # Configuration Vite
```

## 🔍 Rôle des dossiers clés

### `/public`
Le dossier `public` sert les fichiers qui ne doivent pas être modifiés par le bundler (Vite). Il contient notamment les images volumineuses compressées (comme `hero-bg.webp`), le `robots.txt` et le `sitemap.xml` pour le SEO. L'URL d'un asset public depuis l'application commence par `/`.

### `/src/components`
Les briques de l'interface utilisateur. Elles sont segmentées par "domaine" pour éviter d'avoir un dossier de 50 fichiers plats :
- `layout/` : Composants présents sur toutes les pages.
- `home/` : Composants spécifiques qui constituent l'immense landing page (Hero, Testimonials, etc.).
- `contact/` : Formulaires complexes isolés de la vue principale.

### `/src/pages`
Chaque fichier dans ce dossier correspond à une route spécifique accessible par l'utilisateur (URL). Une page agit comme un "orchestrateur", important les layouts et les composants pour constituer une vue finale complète.

### `/src/hooks`
Encapsule les logiques complexes. Par exemple, si nous avons besoin de détecter quand un élément entre dans la zone d'affichage (Viewport) pour lancer une animation, nous le gérons avec un hook (`useRevealInView.ts`).

### `/src/constants.ts`
Un fichier vital pour garantir la consistance du design. Contient les codes couleurs hexa (`ORANGE`, `DARK`, `LIGHT_GRAY`), des breakpoints éventuels ou des URL externes réutilisées, évitant ainsi le *magic number/string*.
