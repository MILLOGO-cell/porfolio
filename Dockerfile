# Construction en deux etapes.
#
# L'image precedente pesait 2,38 Go : une base `node:20` complete (environ
# 1,1 Go) portant l'integralite des dependances de developpement, source
# comprise. C'est ce poids qui a fait echouer le deploiement a l'etape
# « exporting layers », le build lui-meme s'etant termine sans erreur.
#
# Deux leviers, dans cet ordre d'importance :
#   - `node:20-slim` au lieu de `node:20`, qui economise a lui seul environ
#     900 Mo. Prisma exige `openssl`, installe explicitement ;
#   - une etape d'execution qui n'installe que les dependances de production :
#     TypeScript, ESLint, Tailwind et les typages ne servent qu'a construire.

# ---------------------------------------------------------------- construction
FROM node:20-slim AS build

RUN apt-get update -y && \
    apt-get install -y --no-install-recommends openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./

# NODE_ENV=development pendant l'installation : sinon npm saute les
# devDependencies, dont TypeScript et Tailwind, et la construction echoue.
ENV NODE_ENV=development
# npm install et non npm ci : le verrou est produit sous Windows, ou npm
# enregistre l arbre des dependances optionnelles propres a la plateforme. Sous
# Linux, sharp reclame @emnapi/runtime a un emplacement absent du verrou, et
# npm ci, qui exige une correspondance exacte, refuse de continuer.
RUN npm install

COPY . .

RUN npx prisma generate

# La construction, elle, doit tourner en production : en developpement, Next
# rencontre des erreurs de prerendu.
ENV NODE_ENV=production
RUN npm run build

# ------------------------------------------------------------------ execution
FROM node:20-slim AS runtime

RUN apt-get update -y && \
    apt-get install -y --no-install-recommends openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production

# Le schema est copie AVANT l'installation : le script de post-installation de
# `@prisma/client` genere alors le client contre le bon schema, sans qu'il faille
# le recuperer de l'etape precedente.
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm install --omit=dev && npm cache clean --force

# Seulement ce que l'execution demande : le build, les fichiers publics, la
# configuration, et les scripts appeles au demarrage.
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.mjs ./next.config.mjs
COPY --from=build /app/scripts ./scripts

EXPOSE 3000
ENV PORT=3000

# Les migrations sont appliquées au démarrage, pas au build : au build, la base
# de production n'est pas joignable. Sans cette étape, le conteneur démarre sur
# un schéma périmé et toute requête sur une colonne récente échoue.
# `migrate deploy` est idempotent et pose un verrou consultatif : plusieurs
# instances qui démarrent en même temps ne se marchent pas dessus.
#
# `ensure-admin` amorce ensuite le compte administrateur depuis ADMIN_EMAIL /
# ADMIN_PASSWORD. Il est idempotent et ne fait jamais échouer le démarrage.
#
# `prisma` et `tsx` sont pour cette raison des dependances de production et non
# de developpement : elles sont necessaires au demarrage du conteneur.
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx scripts/ensure-admin.ts; npm run start"]
