# Navigation et Routage

La navigation du projet est gérée par **React Router DOM**, configurée en mode Client-Side Routing. L'expérience se veut fluide, sans rechargement de page (Single Page Application).

## 🗺️ Configuration des Routes (`main.tsx` ou `App.tsx`)
Les routes définissent le squelette de l'application :
- `/` : `Home` (Page d'accueil)
- `/about` : `About` (À propos)
- `/solutions` : `Solutions` (Catalogue des solutions)
- `/services` : `Services` (Catalogue des services)
- `/blog` : `Blog` (Actualités)
- `/contact` : `Contact` (Formulaire)

## 🧭 Le composant Navbar
Le composant `Navbar` est le cœur névralgique de la navigation :

### 1. Menu Mobile
Sur les petits écrans, la Navbar bascule en mode `hamburger`. 
- Géré via un état `isMenuOpen` et un rendu conditionnel encapsulé dans `<AnimatePresence>` (Framer Motion) pour un slide-in fluide.
- Les sous-menus (Solutions, Services) peuvent être déroulés (Toggle) via des icônes de type accordéon, gérés par `isSolutionsOpen` et `isServicesOpen`.

### 2. Dropdowns Desktop
Sur grand écran, le survol (`onMouseEnter`) déclenche l'ouverture de méga-menus (Dropdowns).
- Géré par les états locaux `isSolutionsOpen` et `isServicesOpen`.
- **Fermeture automatique** : Un `useEffect` écoute la touche `Escape` ou le clic à l'extérieur (via `closest('.wrapper')`) pour replier le menu, améliorant ainsi l'UX.

### 3. Ancres (`#`) et Navigation interne
React Router s'occupe de la gestion des ancres via le composant `NavLink`. Par exemple :
`<NavLink to="/services#cybersecurite">`
Cela permet de cibler directement une section spécifique dans la page de destination.

### 4. Barre de Recherche
La Navbar inclut une fonctionnalité de recherche globale (`isSearchOpen`).
- Elle filtre dynamiquement les éléments fusionnés des différentes catégories (Solutions, Services).
- Appuyer sur `Enter` redirige instantanément vers le premier résultat trouvé.

## 👣 Le Footer
Le Footer fournit une navigation secondaire (Liens du bas) et des accès directs aux pages "À Propos", "Blog" et "Contact", garantissant qu'un utilisateur arrivé en bas de page puisse continuer sa navigation sans remonter.
