# Stratégie de Performance

L'application IntegralTech Frontend a été conçue pour offrir un temps de chargement ultra-rapide (TTV/TTI) malgré son interface riche.

## 🖼️ Optimisation des Images

- **Format WebP** : Le visuel massif du fond d'écran (`hero-bg`) a été converti du PNG originel vers le WebP, réduisant drastiquement son poids (de près de 2 Mo à ~50 Ko) sans perte visible de qualité.
- **Attributs de Chargement** : 
  - `loading="eager"` et `fetchPriority="high"` appliqués exclusivement sur le `hero-bg.webp` pour s'assurer qu'il s'affiche instantanément.
  - `loading="lazy"` appliqué aux images du Footer et des sections inférieures pour différer leur téléchargement tant qu'elles ne sont pas visibles.
- **Décodage asynchrone** : Utilisation de `decoding="async"` pour éviter de bloquer le thread principal pendant le traitement de l'image.

## 📦 Build et Bundle (Vite)

- Le moteur de compilation **Vite** (utilisant esbuild/rollup) minifie automatiquement les fichiers JS/CSS et retire le code inutilisé (Tree Shaking).
- Le build de production sépare les chunks avec efficacité (fichiers gzippés).

## 폰 Polices de caractères (Fonts)

- Les polices (Open Sans et Outfit) sont pré-connectées (`preconnect` vers Google Fonts) dans `index.html`.
- Seules les graisses (`fontWeight`) réellement utilisées dans l'application ont été importées. Les polices inutiles ont été purgées.

## 🚀 Optimisations Déjà Réalisées
- Suppression totale des images PNG non optimisées.
- Remplacement du `<img src="#">` par de vraies ancres de routage.
- Gestion des états locaux très ciblés pour éviter des re-renders de l'arbre DOM complet (ex. Navbar).

## 🔮 Optimisations Futures
Si le projet s'agrandit :
- **Code-Splitting (Lazy Loading JS)** : Mettre en place `React.lazy()` et `<Suspense>` autour des pages lourdes pour fragmenter le bundle JS. Actuellement (bundle gzippé ~176KB), l'application entière se charge assez vite pour ne pas imposer de fractionnement.
- **CDN Images** : Si plus d'images sont ajoutées, intégrer un CDN d'optimisation (Cloudinary, Imgix).
