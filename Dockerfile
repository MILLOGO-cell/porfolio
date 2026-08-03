FROM node:20

# Install system dependencies for Prisma
RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# CRITICAL: Force development mode during install and build 
# so that devDependencies (like TypeScript) are NOT skipped.
ENV NODE_ENV=development
RUN npm install

# Copy source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js (must use NODE_ENV=production to avoid prerender issues)
ENV NODE_ENV=production
RUN npm run build
EXPOSE 3000
ENV PORT=3000

# Les migrations sont appliquées au démarrage, pas au build : au build, la base
# de production n'est pas joignable. Sans cette étape, le conteneur démarre sur
# un schéma périmé et toute requête sur une colonne récente échoue.
# `migrate deploy` est idempotent et pose un verrou consultatif : plusieurs
# instances qui démarrent en même temps ne se marchent pas dessus.
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
