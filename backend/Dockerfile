# ================================
# ÉTAPE 1 : Build
# ================================
FROM node:18-bullseye-slim AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installer les dépendances prod + Prisma CLI aligné avec @prisma/client (5.22.0 via lockfile)
RUN npm ci --omit=dev && npm install --no-save prisma@5.22.0

# Generate Prisma client with a pinned CLI version matching @prisma/client
RUN npx prisma generate

# ================================
# ÉTAPE 2 : Production
# ================================
FROM node:18-bullseye-slim AS production

WORKDIR /app

# Required by HEALTHCHECK command
RUN apt-get update && apt-get install -y --no-install-recommends wget && rm -rf /var/lib/apt/lists/*

# Copier depuis le builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Copier le code source
COPY . .

# Créer le dossier uploads
RUN mkdir -p uploads/properties

# Exposer le port
EXPOSE 5000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/health || exit 1

# Démarrer le serveur
CMD ["node", "server.js"]
