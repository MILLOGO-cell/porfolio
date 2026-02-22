FROM node:20-slim

WORKDIR /app

# Install dependencies using standard install (safer than ci for folder locking)
COPY package.json package-lock.json ./
RUN npm install

# Copy source
COPY . .

# Generate Client & Build
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["npm", "run", "start"]
