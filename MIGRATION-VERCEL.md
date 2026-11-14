# Migration vers Vercel + Neon

Code déjà adapté (branche `vercel-neon`) : `directUrl` dans le schéma Prisma,
`postinstall` + `vercel-build` (migrations puis admin puis build), envoi des
images vers Vercel Blob au lieu du disque.

## 1. Neon (base)
1. Créer un projet sur neon.tech, région la plus proche (Europe).
2. Copier deux chaînes : **pooled** (host contient `-pooler`) → `DATABASE_URL`,
   **direct** → `DIRECT_URL`. Ajouter `?sslmode=require` si absent.
3. (FAIT le 14/11/2026 : 7 projets, 1 admin, 4 visiteurs, 52 visites reprises.) Reprendre les données de l'ancien serveur (sinon base vide, le build ne crée que le schéma) :
   `pg_dump --data-only --no-owner -Fc <ancienne_url> > portfolio.dump`
   puis, après le premier déploiement (schéma créé) :
   `pg_restore --data-only --no-owner -d "<DIRECT_URL>" portfolio.dump`

## 2. Vercel
1. vercel.com → Add New Project → importer `MILLOGO-cell/porfolio`, branche `vercel-neon` (puis `main` une fois fusionnée).
2. Onglet Storage → créer un **Blob** store et le lier au projet : ajoute `BLOB_READ_WRITE_TOKEN`.
3. Variables d'environnement : `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_SECRET`,
   `NEXTAUTH_URL` (l'adresse finale du site), `ADMIN_EMAIL`, `ADMIN_PASSWORD`,
   `ADMIN_NAME`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO`,
   `GITHUB_ID`, `GITHUB_SECRET`. Valeurs : copier celles du serveur actuel.
4. Deploy.

## 3. Après le déploiement
- GitHub OAuth : mettre à jour l'URL de callback (`<site>/api/auth/callback/github`).
- Adresse : le projet s'appelle `nicolas-millogo` → `https://nicolas-millogo.vercel.app` (valeur par défaut dans `src/lib/site.ts`). Si Vercel ajoute un suffixe parce que le nom est pris, définir `NEXT_PUBLIC_SITE_URL` avec l'adresse réelle. Le domaine `millogo-studio.com` n'est plus utilisé par le portfolio.
- Anciennes images `/uploads/...` du serveur : non migrées automatiquement.
  Les ré-envoyer depuis l'admin, ou les copier dans `public/uploads/` avant de pousser.
- Ne couper l'ancien serveur qu'après avoir vérifié : accueil, projets, formulaire de contact (mail), connexion admin, envoi d'une image.

## 4. Mise à niveau du site (14/11/2026)
Pages légales (/mentions-legales, /confidentialite, /conditions), lien « Gérer les cookies »,
métadonnées par page, image d'aperçu générée, sitemap.xml et robots.txt, en-têtes HTTPS/HSTS,
champ piège anti-spam, Vercel Analytics + Speed Insights, page 404, un seul appel à l'action.
Mesuré en local (mobile) : performance 95-99, accessibilité 100, SEO 100.
À faire sur Vercel : activer Analytics et Speed Insights (onglets du projet), définir
NEXT_PUBLIC_SITE_URL si l'adresse change. Protocole complet : skill `livraison-site`.
