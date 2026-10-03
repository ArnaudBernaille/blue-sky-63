# Déploiement privé sur Firebase

Les pages de la racine (`index.html`, `serie-*.html`) restent les sources : on les édite comme avant.
`node deploy/build.mjs` produit `public/`, où chaque page est compressée et chiffrée (AES-256-GCM) et remplacée
par une page de connexion Google. Après connexion, la clé est lue dans Firestore (seulement pour les comptes
autorisés), la page est déchiffrée et affichée. La progression (`bluesky63`, `bluesky86`…) est synchronisée dans
Firestore, `users/{uid}`, la version la plus récente gagnant, série par série.

## Mise en place (une fois)

1. **Projet** : sur https://console.firebase.google.com, créer un projet (offre gratuite Spark, sans carte).
2. **Appli Web** : Paramètres du projet → Vos applications → ajouter une appli Web. Copier `apiKey`, `authDomain`,
   `projectId`, `appId` dans `deploy/config.js`.
3. **Connexion** : Authentication → Commencer → Méthode de connexion → Google → activer.
4. **Base** : Firestore Database → Créer une base de données → mode production.
5. **Données de configuration** (Firestore → Données) :
   - collection `config`, document `key`, champ `k` (string) = contenu de `secrets/content-key.txt`
     (créé par le premier `node deploy/build.mjs`) ;
   - collection `config`, document `access`, champ `emails` (array) = les adresses Google autorisées, en minuscules.
6. **Outil** : `npm install -g firebase-tools`, puis `firebase login`, puis `firebase use --add` (choisir le projet).

## Déployer

```
node deploy/build.mjs
node deploy/test.mjs
firebase deploy --only hosting,firestore:rules
```

Le site est alors sur `https://<projet>.web.app`.

## À savoir

- **Garder `secrets/content-key.txt`.** Si la clé est perdue, en recréer une (supprimer le fichier, relancer le build)
  et mettre la nouvelle valeur dans `config/key`.
- **Retirer un accès** : enlever l'adresse de `config/access`. La personne ne peut plus lire la clé ni sa progression ;
  si elle a déjà lu la clé, changer la clé (point précédent) et redéployer.
- **Nouvel appareil** : la progression enregistrée dans Firestore remplace celle du navigateur. La progression
  enregistrée ailleurs (fichier ouvert en local, GitHub Pages) n'est pas reprise : elle est liée à l'adresse du site.
- **Transfert** : chaque page chiffrée a un nom qui dépend de son contenu et est mise en cache par le navigateur
  sans limite. Un appareil ne la télécharge qu'une fois par version (environ 290 Ko pour la Series 63).
