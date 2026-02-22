FROM node:20-slim

# Install system dependencies for Prisma and Next.js
RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install all dependencies (including devDeps for build)
COPY package.json package-lock.json ./
RUN npm install

# Copy source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js (requires typescript for next.config.ts)
RUN npm run build

# Final cleanup to reduce image size (optional but good)
# RUN npm prune --production

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["npm", "run", "start"]
