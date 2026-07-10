# Optimisation SEO

IntegralTech a été optimisé pour le référencement naturel (SEO) afin d'assurer une visibilité maximale sur les moteurs de recherche. Voici les éléments mis en place.

## 📄 Balises Meta (`index.html`)

Le fichier `index.html` centralise les métadonnées globales. Bien qu'il s'agisse d'une SPA (Single Page Application), ces balises garantissent que les robots d'indexation comprennent le contexte de la racine.

- **Title** : `IntegralTech | Solutions IT et transformation numérique`
- **Meta Description** : Description claire des activités de l'entreprise.
- **Mots-clés** : IT, cybersécurité, cloud, ERP...
- **Langue et Charset** : `lang="fr"` et `UTF-8`.
- **Robots** : `index, follow` pour autoriser l'exploration.
- **Canonical** : Définit l'URL source principale (https://integraltech.ma/).

## 🌐 OpenGraph et Twitter Cards

Des balises spécifiques aux réseaux sociaux sont intégrées pour obtenir des aperçus esthétiques (Rich Cards) lors du partage du lien :
- `og:title`, `og:description`, `og:image` (pointant sur le visuel `hero-bg.webp`), `og:type` (website).
- `twitter:card` (summary_large_image).

## 🤖 `robots.txt` et `sitemap.xml`

Ces deux fichiers sont stockés dans le dossier `/public`.
- **`robots.txt`** : Autorise tous les User-agents et indique l'URL du Sitemap.
- **`sitemap.xml`** : Liste structurée des routes et ancres essentielles du site (`/`, `/#about`, `/#solutions`, `/#services`, `/#blog`, `/#contact`), avec des priorités (`priority`) et des fréquences de mise à jour (`changefreq`).

## 🖼️ Images et Accessibilité (SEO technique)

- **Balises `alt`** : Toutes les images (`<img />`) possèdent un attribut `alt` descriptif (ex: `alt="IntegralTech"`).
- **Sémantique** : Utilisation adéquate des balises de navigation (`<nav>`, `<footer>`, `<main>`, `<h1>`).

## 📈 Bonnes Pratiques Futures (SSR)
Étant une SPA pure (Vite React), le contenu est rendu côté client. Si le SEO devient critique au niveau de chaque page individuelle, il sera recommandé d'évoluer vers une approche SSR (Server-Side Rendering) ou SSG (Static Site Generation) en utilisant des outils comme **Next.js** ou **Vite-plugin-ssr (Vike)**. Actuellement, la structure sémantique compense efficacement ce point pour une vitrine classique.
