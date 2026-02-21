# ================================
# ÉTAPE 1 : Installation dépendances
# ================================
FROM node:18-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci

# ================================
# ÉTAPE 2 : Build Next.js
# ================================
FROM node:18-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ensure public directory exists so final COPY never fails
RUN mkdir -p public

# Variables d'environnement au build
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_NAME=IdrissVillaStyle
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME

# Build production
RUN npm run build

# ================================
# ÉTAPE 3 : Production
# ================================
FROM node:18-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copier seulement ce qui est nécessaire
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
