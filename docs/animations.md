# Animations et GSAP

Le projet IntegralTech s'appuie fortement sur des animations fluides et professionnelles pour garantir une expérience utilisateur (UX) "Premium". L'outil principal utilisé est **GSAP** (GreenSock Animation Platform), couplé occasionnellement avec **Framer Motion** pour des besoins spécifiques liés au cycle de vie React.

## 🛠 Où GSAP est-il utilisé ?

GSAP est utilisé dans la quasi-totalité des composants majeurs de la page d'accueil (`Hero`, `About`, `StatsBar`, etc.), ainsi que dans le `Footer`.
- **Hero** : Animations d'entrée (Fade-in, slide-up, apparition mot-par-mot), Parallaxe au défilement et mouvement relatif à la souris.
- **Sections (Scroll)** : Révélation d'éléments au fur et à mesure que l'utilisateur défile vers le bas.
- **Micro-interactions** : Survol (hover) sur les boutons (CTA) ou les icônes sociales du Footer (scale, changement de couleur).

## 🚀 ScrollTrigger
Le plugin `ScrollTrigger` de GSAP est l'élément central pour synchroniser les animations avec le défilement.
- **Utilisation classique** : Déclencher un timeline (`tl.from()`) dès qu'une section (`ref`) croise le Viewport (ex. `start: "top 80%"`).
- **Parallaxe et Scrubbing** : Lier l'avancée de l'animation directement à la position du scroll (ex. pour le fond du Hero, `scrub: 0.5`).

## ✨ Bonnes Pratiques GSAP dans React

1. **`useLayoutEffect` vs `useEffect`** :
   Toujours utiliser `useLayoutEffect` pour définir des animations GSAP afin d'éviter le FOUC (Flash Of Unstyled Content) ou un rendu saccadé, car `useLayoutEffect` s'exécute de façon synchrone avant le repeint de l'écran.

2. **GSAP Context (`gsap.context`)** :
   Indispensable en React 18+ (Mode strict). Il englobe toutes les animations d'un composant et permet un nettoyage propre.
   ```javascript
   useLayoutEffect(() => {
     const ctx = gsap.context(() => {
       // Toutes les animations ici
     }, containerRef);
     return () => ctx.revert(); // Nettoie tout au démontage !
   }, []);
   ```

3. **Préférence de mouvement réduit** :
   Le projet respecte les préférences de l'OS de l'utilisateur.
   ```javascript
   const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
   if (prefersReducedMotion) return; // Stoppe l'animation
   ```

## ➕ Comment ajouter une nouvelle animation ?

1. Créez une **Ref** sur l'élément conteneur et sur l'élément cible : `const boxRef = useRef(null);`
2. Importez `useLayoutEffect` de React et `gsap`.
3. Créez votre `gsap.context` lié au conteneur.
4. Définissez votre tween : `gsap.from(boxRef.current, { y: 50, opacity: 0, duration: 1 })`.
5. N'oubliez pas le nettoyage `return () => ctx.revert()`.
