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

CMD ["npm", "run", "start"]
