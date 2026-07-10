# Guide de Contribution

Ce document rassemble les conventions et bonnes pratiques pour maintenir ou faire évoluer l'application IntegralTech Frontend.

## ➕ Ajouter une Nouvelle Page

1. **Créer le fichier** : Créez un nouveau composant dans `src/pages/` (ex: `Pricing.tsx`).
2. **Structure de base** :
   ```tsx
   import { LIGHT_GRAY, DARK } from "../constants";
   
   export default function PricingPage() {
     return (
       <main style={{ minHeight: "100vh", background: LIGHT_GRAY, color: DARK, padding: "100px 24px" }}>
         {/* Contenu */}
       </main>
     );
   }
   ```
3. **Mettre à jour les Routes** : Allez dans `src/App.tsx` (ou le fichier gérant vos routes principales). Importez votre page et ajoutez `<Route path="/pricing" element={<PricingPage />} />`.
4. **Mettre à jour la Navigation** : Ouvrez `src/components/layout/Navbar.tsx` et ajoutez `{ label: "Tarifs", to: "/pricing" }` dans le tableau `links`.
5. **SEO** : N'oubliez pas d'ajouter la nouvelle route au `sitemap.xml`.

## 🧩 Ajouter un Composant (Section)

1. Déterminez son emplacement : S'il est utilisé uniquement sur la page Home, créez-le dans `src/components/home/`. S'il est global, dans `src/components/layout/` ou `src/components/ui/`.
2. Nommez le fichier en PascalCase (ex: `PricingCard.tsx`).
3. Exportez par défaut : `export default function PricingCard() { ... }`

## ✨ Ajouter une Animation GSAP (Scroll)

Pour animer l'apparition d'un nouvel élément au défilement :

1. Déclarez une référence : `const sectionRef = useRef<HTMLDivElement>(null);`
2. Importez `useLayoutEffect` de React et `gsap` (+ `ScrollTrigger`).
3. Utilisez le pattern de contexte :
   ```tsx
   useLayoutEffect(() => {
     const ctx = gsap.context(() => {
       gsap.from(sectionRef.current, {
         opacity: 0,
         y: 30,
         duration: 0.8,
         ease: "power3.out",
         scrollTrigger: {
           trigger: sectionRef.current,
           start: "top 80%"
         }
       });
     }, sectionRef);
     return () => ctx.revert();
   }, []);
   ```

## 📐 Conventions de Nommage

- **Dossiers** : minuscules, mots séparés par des tirets (kebab-case) si nécessaire, mais un seul mot recommandé (ex: `components`, `home`).
- **Fichiers React (Composants/Pages)** : PascalCase (ex: `Navbar.tsx`, `AboutPage.tsx`).
- **Fichiers non-React (Hooks, Utils)** : camelCase (ex: `useRevealInView.ts`, `constants.ts`).
- **Styles** : L'utilisation de style *inline* propre est courante dans ce projet pour la performance, mais les classes réutilisables vont dans `styles/globals.css`.

## 🛡️ Bonnes Pratiques Globales

- **TypeScript** : Typage explicite (pas de `any`). Utilisez les interfaces pour les props (`interface CardProps { title: string; }`).
- **Couleurs** : Utilisez toujours les constantes importées de `constants.ts` (`DARK`, `ORANGE`) au lieu de hardcoder les codes hexadécimaux pour garder une cohérence UI et faciliter les refontes.
- **Vérification** : Avant chaque commit, lancez `npm run typecheck` et `npm run build` pour vous assurer qu'aucune erreur TypeScript n'est passée à la trappe.
