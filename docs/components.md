# Documentation des Composants

L'interface du projet IntegralTech est construite avec des composants React strictement typés via TypeScript. Voici un répertoire exhaustif des composants majeurs de l'application.

## 🗂️ Dossier Layout (`src/components/layout/`)

### `Navbar`
- **Description** : Barre de navigation principale. Fixée (sticky) en haut de page.
- **Responsabilité** : Gérer les liens globaux, l'état du menu mobile, la recherche globale et les menus déroulants (Solutions, Services).
- **Animations** :
  - **GSAP** : Animation d'entrée (`opacity`, `y`) au montage de l'app.
  - **Framer Motion** : Apparition des dropdowns au hover/click via `<AnimatePresence>`.
- **Props** : Aucune.
- **Dépendances** : `react-router-dom`, `framer-motion`, `gsap`, `lucide-react`.
- **Utilisation** : Placée dans le layout racine (`App.tsx`).

### `Footer`
- **Description** : Pied de page global de l'application.
- **Responsabilité** : Afficher les liens utiles, les droits, le logo et les réseaux sociaux.
- **Animations** : Survol (Hover) des réseaux sociaux via GSAP (`y: -3`, color swap).
- **Props** : Aucune.
- **Dépendances** : `lucide-react`, `gsap`.
- **Utilisation** : Placée à la fin du layout racine (`App.tsx`).

### `TopBar`
- **Description** : Petite barre fine au-dessus de la Navbar.
- **Responsabilité** : Afficher les informations de contact rapides (Téléphone, Email).
- **Animations** : Aucune. Masquée en CSS sur mobile.
- **Props** : Aucune.
- **Utilisation** : Placée dans le layout racine (`App.tsx`), tout en haut.

---

## 🗂️ Dossier Home (`src/components/home/`)

### `Hero`
- **Description** : Le bloc principal d'appel à l'action de la page d'accueil (Bannière).
- **Responsabilité** : Captez l'attention avec une image de fond (WebP), un gradient sombre, et un titre percutant.
- **Animations** : 
  - GSAP Timeline complexe à l'ouverture.
  - Animation mot-par-mot (stagger) du titre.
  - Effet Parallaxe au scroll (fond) et au mouvement de la souris (contenu).
- **Dépendances** : `gsap`, `gsap/ScrollTrigger`.
- **Utilisation** : Composant de tête de la page `Home.tsx`.

### `StatsBar`
- **Description** : Bandeau affichant les chiffres clés de l'entreprise.
- **Responsabilité** : Donner de la crédibilité (Années d'expérience, Clients satisfaits, etc.).
- **Animations** : Apparition fluide au défilement (ScrollTrigger).
- **Utilisation** : Placée sous le `Hero`.

### `Services`
- **Description** : Section récapitulative des domaines d'expertise (Cloud, Cybersécurité).
- **Responsabilité** : Rediriger l'utilisateur vers des solutions spécifiques.
- **Animations** : Effet de soulèvement (Hover) et Stagger à l'apparition.
- **Utilisation** : Page d'accueil.

### `About` / `Testimonials` / `CTA`
- **Description** : Sections de réassurance et d'incitation à l'action.
- **Responsabilité** : Fournir plus de contexte sur IntegralTech, afficher des retours clients et diriger vers la page contact.
- **Animations** : Fade-up au défilement (ScrollTrigger).
- **Utilisation** : Page d'accueil.

---

## 🗂️ Dossier Contact (`src/components/contact/`)

### `ContactForm`
- **Description** : Formulaire de contact complet et sécurisé.
- **Responsabilité** : Capter les données de l'utilisateur (Nom, Email, etc.), valider les champs, gérer l'état d'envoi.
- **Animations** : Animation de `:focus` sur les inputs, et apparition douce.
- **Props** : `onSubmit` (optionnel), mais gère l'état de soumission en interne actuellement.
- **Dépendances** : React `useState`.
- **Utilisation** : Dans `Contact.tsx`.
