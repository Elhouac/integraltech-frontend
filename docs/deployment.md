# Guide de Déploiement

Ce projet a été généré via Vite. Contrairement à Create React App, Vite place les fichiers construits dans le dossier `/dist`.
Voici comment déployer l'application sur les principales plateformes.

## 🚀 Prérequis
Avant tout déploiement, assurez-vous que la compilation locale fonctionne sans erreur :
```bash
npm run typecheck
npm run build
```
Si le dossier `dist/` se génère avec succès, vous êtes prêt.

---

## 1. Vercel (Recommandé)
Vercel est la solution la plus simple, idéale pour le frontend.
1. Connectez votre dépôt GitHub, GitLab ou Bitbucket à Vercel.
2. Créez un nouveau projet et sélectionnez le dépôt `integraltech-frontend`.
3. Vercel détectera automatiquement **Vite**.
4. Laissez les commandes par défaut :
   - Build Command : `npm run build`
   - Output Directory : `dist`
5. Cliquez sur **Deploy**. Le routage SPA (redirections vers index.html) est géré automatiquement.

---

## 2. Netlify
1. Connectez votre dépôt Git à Netlify.
2. Build Command : `npm run build`
3. Publish Directory : `dist`
4. **Important (SPA Routing)** : Créez un fichier `public/_redirects` contenant exactement ceci :
   ```
   /* /index.html 200
   ```
   Cela indique à Netlify de rediriger toutes les URLs vers l'application React.

---

## 3. VPS avec Nginx (Ubuntu/Debian)
Si vous hébergez vous-même sur un serveur privé.
1. Côté serveur, installez Nginx : `sudo apt install nginx`.
2. Transférez le contenu de votre dossier `/dist` local vers `/var/www/integraltech` sur le serveur.
3. Configurez Nginx (`/etc/nginx/sites-available/integraltech`) :
   ```nginx
   server {
       listen 80;
       server_name integraltech.ma www.integraltech.ma;
       
       root /var/www/integraltech;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```
4. Activez et relancez : `sudo ln -s /etc/nginx/sites-available/integraltech /etc/nginx/sites-enabled/` puis `sudo systemctl reload nginx`.

---

## 4. Apache
Si vous utilisez un serveur Apache (hébergement mutualisé classique) :
1. Envoyez le dossier `/dist` sur le serveur via FTP.
2. **Important (SPA Routing)** : Dans le dossier racine public, ajoutez un fichier `.htaccess` contenant :
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```
