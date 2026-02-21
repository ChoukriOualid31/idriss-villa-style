# Guide Docker — Idriss Villa Style

> Déploiement avec Docker Hub après Railway (MySQL)

---

## 📋 Table des matières

1. [Comprendre Docker Hub vs Railway](#1-comprendre-docker-hub-vs-railway)
2. [Installer Docker](#2-installer-docker)
3. [Créer un compte Docker Hub](#3-créer-un-compte-docker-hub)
4. [Option A — Tester en local (docker-compose)](#4-option-a--tester-en-local-docker-compose)
5. [Option B — Publier sur Docker Hub](#5-option-b--publier-sur-docker-hub)
6. [Option C — Déployer depuis Docker Hub vers un VPS](#6-option-c--déployer-depuis-docker-hub-vers-un-vps)
7. [Commandes Docker essentielles](#7-commandes-docker-essentielles)

---

## 1. Comprendre Docker Hub vs Railway

```
VOTRE STACK ACTUELLE
────────────────────
GitHub (code) → Render (backend) → Railway (MySQL)
                Vercel (frontend)

AVEC DOCKER HUB
───────────────
GitHub (code)
    ↓ build
Docker Hub (images stockées)
    ↓ pull
VPS / Railway / Render (déploiement)
```

### Quand utiliser Docker Hub ?

| Situation | Recommandé ? |
|-----------|-------------|
| Déployer sur un VPS (DigitalOcean, OVH...) | ✅ Oui |
| Partager votre image avec une équipe | ✅ Oui |
| Déployer sur Render (déjà configuré) | ❌ Non nécessaire |
| Déployer sur Vercel (déjà configuré) | ❌ Non nécessaire |
| Tester en local avec Docker | ✅ Pratique |

> **Conseil** : Votre stack actuelle (Render + Vercel + Railway MySQL) est déjà optimale.
> Docker Hub est utile si vous voulez migrer vers un **VPS**.

---

## 2. Installer Docker

### Windows

1. Téléchargez [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Installez et redémarrez votre PC
3. Vérifiez :

```bash
docker --version
docker compose version
```

### macOS

```bash
brew install --cask docker
```

### Linux (Ubuntu)

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker
```

---

## 3. Créer un compte Docker Hub

1. Allez sur [hub.docker.com](https://hub.docker.com)
2. **Sign Up** → créez votre compte
3. Notez votre **username** (ex: `idriss-villa`)
4. Connectez-vous depuis le terminal :

```bash
docker login
# Entrez votre username et password Docker Hub
```

---

## 4. Option A — Tester en local (docker-compose)

Le fichier `docker-compose.yml` lance les 3 services ensemble :
- MySQL local
- Backend Node.js
- Frontend Next.js

```bash
# Se placer à la racine du projet
cd "c:/khadma/Kimi_Agent_Marketplace immobilier complet/idriss-villa-style"

# Lancer tous les services
docker compose up --build

# En arrière-plan
docker compose up --build -d

# Vérifier que tout tourne
docker compose ps

# Voir les logs
docker compose logs -f backend
docker compose logs -f frontend
```

Accès :
- Frontend : http://localhost:3000
- Backend API : http://localhost:5000
- Health check : http://localhost:5000/health

```bash
# Arrêter tout
docker compose down

# Arrêter et supprimer les données
docker compose down -v
```

---

## 5. Option B — Publier sur Docker Hub

### Construire et pousser le backend

```bash
# Remplacez VOTRE-USERNAME par votre username Docker Hub
export DOCKER_USERNAME=VOTRE-USERNAME

# Build du backend
docker build -t $DOCKER_USERNAME/idriss-villa-api:latest ./backend

# Pousser sur Docker Hub
docker push $DOCKER_USERNAME/idriss-villa-api:latest

# Avec un tag de version
docker build -t $DOCKER_USERNAME/idriss-villa-api:v1.0.0 ./backend
docker push $DOCKER_USERNAME/idriss-villa-api:v1.0.0
```

### Construire et pousser le frontend

```bash
# Build du frontend avec l'URL de l'API
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://idriss-villa-api.onrender.com/api \
  -t $DOCKER_USERNAME/idriss-villa-frontend:latest \
  ./frontend

# Pousser
docker push $DOCKER_USERNAME/idriss-villa-frontend:latest
```

### Vérifier sur Docker Hub

Vos images sont maintenant visibles sur :
```
https://hub.docker.com/r/VOTRE-USERNAME/idriss-villa-api
https://hub.docker.com/r/VOTRE-USERNAME/idriss-villa-frontend
```

---

## 6. Option C — Déployer depuis Docker Hub vers un VPS

Si vous avez un VPS (OVH, DigitalOcean, etc.) avec Docker installé :

```bash
# Sur votre VPS — créer le fichier .env
cat > .env << EOF
MYSQL_ROOT_PASSWORD=VotreMotDePasse
MYSQL_PASSWORD=idrisspass
JWT_SECRET=a3f8c2d1e4b7a9f0c3d6e2b5a8f1c4d7e0b3a6f9c2d5e8b1a4f7c0d3e6b9a2f5
DATABASE_URL=mysql://root:CnKwgwGPNAzhmwJNLHfCOxericNeBENh@gondola.proxy.rlwy.net:53089/railway
EOF

# Créer docker-compose.prod.yml
cat > docker-compose.prod.yml << EOF
version: '3.8'
services:
  backend:
    image: VOTRE-USERNAME/idriss-villa-api:latest
    restart: always
    env_file: .env
    environment:
      DATABASE_URL: \${DATABASE_URL}
      JWT_SECRET: \${JWT_SECRET}
      NODE_ENV: production
      PORT: 5000
      FRONTEND_URL: https://votre-domaine.com
    ports:
      - "5000:5000"

  frontend:
    image: VOTRE-USERNAME/idriss-villa-frontend:latest
    restart: always
    environment:
      NEXT_PUBLIC_API_URL: https://votre-domaine.com/api
    ports:
      - "3000:3000"
EOF

# Télécharger et lancer depuis Docker Hub
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

# Vérifier
docker compose -f docker-compose.prod.yml ps
```

### Mise à jour automatique via GitHub Actions

Créez `.github/workflows/docker.yml` pour automatiser le build et push :

```yaml
name: Build & Push Docker Images

on:
  push:
    branches: [main]

jobs:
  build-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push backend
        uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/idriss-villa-api:latest

      - name: Build and push frontend
        uses: docker/build-push-action@v4
        with:
          context: ./frontend
          push: true
          build-args: |
            NEXT_PUBLIC_API_URL=${{ secrets.NEXT_PUBLIC_API_URL }}
          tags: ${{ secrets.DOCKER_USERNAME }}/idriss-villa-frontend:latest
```

**Secrets à configurer sur GitHub** :
- `DOCKER_USERNAME` → votre username Docker Hub
- `DOCKER_PASSWORD` → votre mot de passe Docker Hub
- `NEXT_PUBLIC_API_URL` → URL de votre API

---

## 7. Commandes Docker essentielles

```bash
# Voir les images locales
docker images

# Voir les containers en cours
docker ps

# Voir tous les containers (arrêtés inclus)
docker ps -a

# Supprimer une image
docker rmi idriss-villa-api

# Supprimer tous les containers arrêtés
docker container prune

# Supprimer toutes les images non utilisées
docker image prune -a

# Entrer dans un container en cours
docker exec -it idriss-villa-api sh

# Voir les logs d'un container
docker logs idriss-villa-api -f

# Redémarrer un container
docker restart idriss-villa-api
```

---

## Récapitulatif des fichiers Docker créés

```
idriss-villa-style/
├── docker-compose.yml          ← Test local complet
├── backend/
│   ├── Dockerfile              ← Image backend Node.js
│   └── .dockerignore           ← Fichiers exclus du build
└── frontend/
    ├── Dockerfile              ← Image frontend Next.js
    └── .dockerignore           ← Fichiers exclus du build
```

---

## Votre workflow recommandé

```
Développement local
───────────────────
Code → docker compose up → test sur localhost

Publication
──────────
git push → GitHub Actions → Docker Hub (images)

Production
──────────
Docker Hub → pull sur VPS → docker compose up -d
   OU
GitHub → Render (backend) + Vercel (frontend)  ← déjà en place !
```
