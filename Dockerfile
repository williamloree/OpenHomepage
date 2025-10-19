# Utiliser Node.js 18 comme image de base
FROM node:18-alpine AS base

# Installer les dépendances nécessaires
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
FROM base AS deps
RUN npm ci

# Builder l'application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Créer le répertoire pour la base de données si nécessaire
RUN mkdir -p server/db

# Build de l'application Nuxt
RUN npm run build

# Image de production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Créer un utilisateur non-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxtjs

# Copier les fichiers nécessaires depuis le builder
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/server/db /app/server/db

# Créer le volume pour persister les données
RUN mkdir -p /app/data
RUN chown -R nuxtjs:nodejs /app

USER nuxtjs

EXPOSE 3000

# Démarrer l'application
CMD ["node", ".output/server/index.mjs"]
