# Guide de Hosting Complet — Idriss Villa Style
## Backend (Render) + Frontend (Vercel) + MySQL (Railway)

> **Stack analysée** : Node.js 18 + Express 4 + Prisma 5.22 + MySQL · Next.js 14.2 + TypeScript + Tailwind CSS
> **Auteur** : Guide produit par analyse complète du projet

---

## 📋 Table des matières

1. [Vue d'ensemble de l'architecture](#1-vue-densemble-de-larchitecture)
2. [Prérequis et comptes nécessaires](#2-prérequis-et-comptes-nécessaires)
3. [ÉTAPE 1 — Base de données Railway MySQL](#3-étape-1--base-de-données-railway-mysql)
4. [ÉTAPE 2 — Backend sur Render](#4-étape-2--backend-sur-render)
5. [ÉTAPE 3 — Frontend sur Vercel](#5-étape-3--frontend-sur-vercel)
6. [ÉTAPE 4 — Connecter Backend et Frontend](#6-étape-4--connecter-backend-et-frontend)
7. [ÉTAPE 5 — Peupler la base de données](#7-étape-5--peupler-la-base-de-données)
8. [ÉTAPE 6 — Vérification complète](#8-étape-6--vérification-complète)
9. [Variables d'environnement — Référence complète](#9-variables-denvironnement--référence-complète)
10. [Dépannage](#10-dépannage)
11. [Maintenance](#11-maintenance)

---

## 1. Vue d'ensemble de l'architecture

### Comment votre application fonctionne en production

```
┌──────────────────────────────────────────────────────────────────┐
│                        INTERNET                                  │
│                                                                  │
│   Utilisateur                                                    │
│       │                                                          │
│       ▼                                                          │
│  ┌────────────────────────────────┐                              │
│  │    VERCEL (Frontend)           │                              │
│  │    Next.js 14 + React 18       │                              │
│  │    TypeScript + Tailwind CSS   │                              │
│  │    idriss-villa.vercel.app     │                              │
│  └────────────┬───────────────────┘                              │
│               │ Requêtes API (HTTPS)                             │
│               │ Axios + JWT Cookie                               │
│               ▼                                                  │
│  ┌────────────────────────────────┐                              │
│  │    RENDER (Backend)            │                              │
│  │    Node.js 18 + Express 4      │                              │
│  │    Prisma ORM 5.22             │                              │
│  │    JWT Auth + bcrypt           │                              │
│  │    idriss-villa-api.onrender   │                              │
│  └────────────┬───────────────────┘                              │
│               │ Connexion Prisma + MySQL2                        │
│               │ mysql://root:pass@host:port/db                   │
│               ▼                                                  │
│  ┌────────────────────────────────┐                              │
│  │    RAILWAY (Base de données)   │                              │
│  │    MySQL 8.0                   │                              │
│  │    gondola.proxy.rlwy.net      │                              │
│  │    Port: 53089                 │                              │
│  └────────────────────────────────┘                              │
└──────────────────────────────────────────────────────────────────┘
```

### Ce que fait chaque service

| Service | Rôle | URL |
|---------|------|-----|
| **Vercel** | Sert le frontend Next.js aux visiteurs | `https://votre-app.vercel.app` |
| **Render** | Exécute l'API Node.js + gère les uploads | `https://idriss-villa-api.onrender.com` |
| **Railway** | Stocke toutes les données MySQL | `gondola.proxy.rlwy.net:53089` |

### Flux d'une requête

```
1. Visiteur ouvre idriss-villa.vercel.app
2. Vercel sert le HTML + JS Next.js
3. Next.js fait GET /api/properties
4. Render reçoit la requête
5. Prisma fait SELECT * FROM properties sur Railway MySQL
6. Données retournées → affichées sur le frontend
```

---

## 2. Prérequis et comptes nécessaires

### Comptes à créer (tous gratuits)

| Plateforme | URL | Pourquoi |
|------------|-----|---------|
| GitHub | [github.com](https://github.com) | Stocker le code + déclencher les déploiements |
| Render | [render.com](https://render.com) | Héberger le backend Node.js |
| Vercel | [vercel.com](https://vercel.com) | Héberger le frontend Next.js |
| Railway | [railway.app](https://railway.app) | Base de données MySQL managée |

### Outils à installer sur votre PC

```bash
# Node.js version 18 minimum
node --version    # Doit afficher v18.x.x ou plus

# npm (inclus avec Node.js)
npm --version     # Doit afficher 9.x.x ou plus

# Git
git --version     # Doit afficher 2.x.x ou plus
```

### Checklist avant de commencer

- [ ] Code du projet sur GitHub (branche `main`)
- [ ] Compte Render connecté à GitHub
- [ ] Compte Vercel connecté à GitHub
- [ ] Base de données Railway créée ✅ (déjà fait)
- [ ] URL publique Railway notée : `mysql://root:CnKwgwGPNAzhmwJNLHfCOxericNeBENh@gondola.proxy.rlwy.net:53089/railway`

---

## 3. ÉTAPE 1 — Base de données Railway MySQL

> ✅ **Votre base Railway est déjà configurée.** Voici les informations pour référence.

### Vos informations Railway

```
Host (public)  : gondola.proxy.rlwy.net
Port           : 53089
Utilisateur    : root
Mot de passe   : CnKwgwGPNAzhmwJNLHfCOxericNeBENh
Base de données: railway

URL complète   :
mysql://root:CnKwgwGPNAzhmwJNLHfCOxericNeBENh@gondola.proxy.rlwy.net:53089/railway
```

### Vérifier la connexion depuis votre PC

```bash
# Dans le dossier backend
cd "c:/khadma/Kimi_Agent_Marketplace immobilier complet/idriss-villa-style/backend"

# Tester que Prisma peut atteindre Railway
npx prisma db pull

# Si succès → vous verrez votre schéma
# Si erreur → vérifiez l'URL dans .env
```

### Comprendre votre base de données

Votre base contient 2 tables principales :

**Table `users`**
```sql
id         VARCHAR(36) PRIMARY KEY  -- UUID généré automatiquement
name       VARCHAR(191)
email      VARCHAR(191) UNIQUE
password   VARCHAR(191)             -- Hashé avec bcrypt (12 rounds)
role       ENUM('USER', 'ADMIN')
createdAt  DATETIME
updatedAt  DATETIME
```

**Table `properties`**
```sql
id          VARCHAR(36) PRIMARY KEY
title       VARCHAR(191)
description TEXT
price       DECIMAL(15,2)
type        ENUM('APARTMENT','HOUSE','VILLA','LAND','OFFICE','COMMERCIAL')
status      ENUM('FOR_SALE','FOR_RENT')
city        VARCHAR(191)
address     VARCHAR(191)
surface     DOUBLE
rooms       INT
bathrooms   INT
images      JSON                    -- Array d'URLs d'images
featured    BOOLEAN
userId      VARCHAR(36)             -- FK vers users.id
createdAt   DATETIME
updatedAt   DATETIME
```

---

## 4. ÉTAPE 2 — Backend sur Render

### 4.1 — Pousser le code sur GitHub

Si ce n'est pas encore fait :

```bash
cd "c:/khadma/Kimi_Agent_Marketplace immobilier complet/idriss-villa-style"

# Vérifier que Git est initialisé
git status

# Si "not a git repository"
git init
git add .
git commit -m "feat: initial commit - Idriss Villa Style"
git remote add origin https://github.com/VOTRE-USERNAME/idriss-villa-style.git
git push -u origin main
```

### 4.2 — Créer le service sur Render

1. Allez sur [render.com](https://render.com)
2. Cliquez sur **New +** → **Web Service**

   ```
   ┌─────────────────────────────────┐
   │  New +  ▼                       │
   │  ├── Web Service    ← choisir   │
   │  ├── Static Site                │
   │  ├── PostgreSQL                 │
   │  └── ...                        │
   └─────────────────────────────────┘
   ```

3. **Connect a repository** → Sélectionnez `idriss-villa-style`

   > Si votre repo n'apparaît pas → cliquez **Configure account** et autorisez Render sur GitHub

4. Remplissez la configuration :

   ```
   Name            : idriss-villa-api
   Region          : Frankfurt (EU Central)   ← le plus proche du Maroc
   Branch          : main
   Root Directory  : backend                  ← IMPORTANT !
   Runtime         : Node
   Build Command   : npm install && npm run build
   Start Command   : npm start
   Plan            : Free
   ```

   > **Pourquoi `Root Directory: backend` ?**
   > Votre repo contient backend/ ET frontend/ dans le même repo.
   > Render doit savoir qu'il doit regarder dans le dossier backend.

5. Faites défiler vers **Environment Variables** → cliquez **Add Environment Variable**

### 4.3 — Configurer les variables d'environnement sur Render

Ajoutez **une par une** ces variables :

| Clé | Valeur | Explication |
|-----|--------|-------------|
| `NODE_ENV` | `production` | Active le mode production (logs réduits, cookies sécurisés) |
| `DATABASE_URL` | `mysql://root:CnKwgwGPNAzhmwJNLHfCOxericNeBENh@gondola.proxy.rlwy.net:53089/railway` | Connexion Railway MySQL |
| `JWT_SECRET` | `a3f8c2d1e4b7a9f0c3d6e2b5a8f1c4d7e0b3a6f9c2d5e8b1a4f7c0d3e6b9a2f5` | Clé de signature des tokens (min 32 caractères) |
| `JWT_EXPIRES_IN` | `7d` | Les tokens durent 7 jours |
| `PORT` | `10000` | Port imposé par Render |
| `FRONTEND_URL` | `https://idriss-villa.vercel.app` | Mettre à jour après déploiement Vercel |
| `ADMIN_EMAIL` | `admin@idrissvilla.com` | Email du compte admin créé au seed |
| `ADMIN_PASSWORD` | `admin123` | Mot de passe admin (à changer après) |

> **Attention** : `FRONTEND_URL` doit correspondre **exactement** à l'URL Vercel.
> Mettez une URL temporaire maintenant, vous la corrigerez à l'étape 6.

### 4.4 — Lancer le déploiement

1. Cliquez sur **Create Web Service**
2. Render va automatiquement exécuter :

   ```bash
   # Phase de build (visible dans les logs Render)
   npm install                        # Installe les 14 dépendances
   npx prisma generate                # Génère le client Prisma MySQL
   npx prisma migrate deploy          # Crée les tables users et properties sur Railway

   # Phase de démarrage
   npm start                          # Lance node server.js sur port 10000
   ```

3. Attendez **3 à 5 minutes** — regardez les logs en direct :

   ```
   [Build] npm install → ✅
   [Build] Prisma generate → ✅
   [Build] Prisma migrate → ✅ Applied 1 migration
   [Start] Server running on port 10000
   [Start] Database connected successfully
   ```

### 4.5 — Vérifier le backend

Une fois le déploiement terminé, testez :

```bash
# Dans votre terminal ou navigateur
curl https://idriss-villa-api.onrender.com/health

# Réponse attendue :
{
  "status": "success",
  "message": "API Idriss Villa Style is running",
  "environment": "production"
}
```

```bash
# Tester l'endpoint des propriétés
curl https://idriss-villa-api.onrender.com/api/properties

# Réponse attendue :
{
  "status": "success",
  "data": [],
  "pagination": { "totalCount": 0, ... }
}
```

> **Normal** : La liste est vide car on n'a pas encore exécuté le seed.

### 4.6 — Comprendre la structure de l'API deployée

Vos endpoints disponibles après déploiement :

```
GET    /health                          → Status de l'API
GET    /api/properties                  → Liste des biens (public)
GET    /api/properties/featured         → Biens en vedette (public)
GET    /api/properties/filters/cities   → Villes disponibles (public)
GET    /api/properties/:id              → Détail d'un bien (public)
POST   /api/properties                  → Créer un bien (admin)
PATCH  /api/properties/:id             → Modifier un bien (admin)
DELETE /api/properties/:id             → Supprimer un bien (admin)
GET    /api/properties/stats/overview   → Statistiques (admin)

POST   /api/auth/register               → Inscription (public)
POST   /api/auth/login                  → Connexion (public)
POST   /api/auth/logout                 → Déconnexion (protégé)
GET    /api/auth/me                     → Profil utilisateur (protégé)
PATCH  /api/auth/update-profile         → Modifier profil (protégé)
PATCH  /api/auth/change-password        → Changer mot de passe (protégé)

GET    /api/users                       → Liste utilisateurs (admin)
GET    /api/users/stats/dashboard       → Stats dashboard (admin)
GET    /api/users/:id                   → Détail utilisateur (admin)
PATCH  /api/users/:id/role             → Modifier rôle (admin)
DELETE /api/users/:id                  → Supprimer utilisateur (admin)

POST   /api/upload/image               → Upload 1 image (admin)
POST   /api/upload/images              → Upload plusieurs images (admin)
DELETE /api/upload/image/:filename     → Supprimer image (admin)
```

---

## 5. ÉTAPE 3 — Frontend sur Vercel

### 5.1 — Créer le projet sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **Add New...** → **Project**

   ```
   ┌─────────────────────────────────┐
   │  Add New...  ▼                  │
   │  ├── Project      ← choisir     │
   │  └── Team                       │
   └─────────────────────────────────┘
   ```

3. **Import Git Repository** → Sélectionnez `idriss-villa-style`

### 5.2 — Configurer le projet Vercel

Remplissez la configuration :

```
Project Name    : idriss-villa-style
Framework       : Next.js           ← Vercel détecte automatiquement
Root Directory  : frontend          ← IMPORTANT : dossier frontend
Build Command   : npm run build     ← next build
Output Directory: .next             ← automatique
Install Command : npm install       ← automatique
```

> **Pourquoi `Root Directory: frontend` ?**
> Même raison que pour Render — le repo monorepo contient backend/ et frontend/.
> Vercel doit construire uniquement le frontend.

### 5.3 — Configurer les variables d'environnement Vercel

Avant de cliquer Deploy, ajoutez les variables :

| Clé | Valeur | Explication |
|-----|--------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://idriss-villa-api.onrender.com/api` | URL complète de votre API Render |
| `NEXT_PUBLIC_APP_NAME` | `Idriss Villa Style` | Nom de l'application |
| `NEXT_PUBLIC_APP_URL` | `https://idriss-villa.vercel.app` | URL du frontend (votre domaine Vercel) |

> **Note `NEXT_PUBLIC_`** : Ce préfixe est obligatoire pour Next.js.
> Les variables avec ce préfixe sont accessibles dans le navigateur du client.
> Sans ce préfixe, la variable serait invisible au frontend.

### 5.4 — Lancer le déploiement

1. Cliquez sur **Deploy**
2. Vercel va exécuter :

   ```bash
   # Phase de build (visible dans les logs Vercel)
   npm install              # Installe React, Next.js, Tailwind, Axios...
   npm run build            # next build → compile TypeScript + optimise

   # Sortie attendue :
   ✓ Compiled successfully
   ✓ Collecting page data
   ✓ Generating static pages (8/8)
   ✓ Finalizing page optimization

   Route (app)                    Size     First Load JS
   ┌ ○ /                          12.4 kB       98.5 kB
   ┌ ○ /properties                8.2 kB        94.3 kB
   ┌ ○ /properties/[id]           6.1 kB        92.2 kB
   ┌ ○ /login                     4.5 kB        90.6 kB
   ┌ ○ /register                  4.3 kB        90.4 kB
   ┌ ○ /contact                   3.8 kB        89.9 kB
   ┌ ○ /admin                     9.2 kB        95.3 kB
   └ ○ /admin/properties          7.8 kB        93.9 kB
   ```

3. Attendez **2 à 3 minutes**

### 5.5 — Récupérer votre URL Vercel

Après déploiement, notez votre URL :

```
https://idriss-villa-style-XXXX.vercel.app
       ou
https://idriss-villa.vercel.app  (si vous avez personnalisé)
```

### 5.6 — Comprendre les pages déployées

Vos pages accessibles après déploiement :

```
/                     → Accueil (propriétés vedettes + stats)
/properties           → Liste avec filtres (ville, type, prix, surface)
/properties/:id       → Détail d'une propriété
/login                → Connexion (JWT + Cookie)
/register             → Inscription
/contact              → Formulaire de contact
/admin                → Dashboard admin (protégé)
/admin/properties     → Gestion des biens CRUD (protégé)
/admin/properties/new → Créer un bien (protégé)
/admin/properties/edit/:id → Modifier un bien (protégé)
/admin/users          → Gestion des utilisateurs (protégé)
```

---

## 6. ÉTAPE 4 — Connecter Backend et Frontend

### 6.1 — Mettre à jour FRONTEND_URL sur Render

1. Allez sur [render.com](https://render.com) → votre service `idriss-villa-api`
2. Onglet **Environment**
3. Trouvez `FRONTEND_URL` → cliquez **Edit**
4. Remplacez par votre vraie URL Vercel :

   ```
   FRONTEND_URL = https://idriss-villa-style-XXXX.vercel.app
   ```

5. Cliquez **Save Changes**

   > Render redéploie automatiquement (~2 minutes)

### 6.2 — Pourquoi c'est critique

```javascript
// backend/server.js — configuration CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,  // ← Si cette URL est fausse
  credentials: true,                  //   toutes les requêtes du frontend
  methods: ['GET', 'POST', ...],      //   seront bloquées avec une erreur CORS
}))
```

**Sans cette configuration correcte :**
```
Access to XMLHttpRequest at 'https://idriss-villa-api.onrender.com/api/properties'
from origin 'https://idriss-villa.vercel.app' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

### 6.3 — Tester la connexion CORS

Ouvrez votre frontend Vercel → F12 → Console → vérifiez qu'il n'y a pas d'erreurs rouges CORS.

---

## 7. ÉTAPE 5 — Peupler la base de données

### 7.1 — Exécuter le seed depuis votre PC

Le seed crée : 1 compte admin + 5 propriétés de démonstration.

```bash
# Dans le dossier backend sur votre PC
cd "c:/khadma/Kimi_Agent_Marketplace immobilier complet/idriss-villa-style/backend"

# Le .env doit contenir l'URL Railway publique
# Vérifiez :
cat .env | grep DATABASE_URL
# DATABASE_URL="mysql://root:CnKwgwGPNAzhmwJNLHfCOxericNeBENh@gondola.proxy.rlwy.net:53089/railway"

# Exécuter le seed
npm run prisma:seed
```

Sortie attendue :
```
🌱 Seeding database...
✅ Admin user created: admin@idrissvilla.com
✅ Property 1 created: Villa Moderne à Tanger
✅ Property 2 created: Appartement de Luxe à Casablanca
✅ Property 3 created: Maison de Standing à Rabat
✅ Property 4 created: Terrain à Marrakech
✅ Property 5 created: Bureau Professionnel à Agadir
🎉 Seeding completed!
```

### 7.2 — Vérifier que le seed a fonctionné

```bash
# Depuis votre navigateur ou terminal
curl https://idriss-villa-api.onrender.com/api/properties

# Vous devez voir 5 propriétés dans la réponse
{
  "status": "success",
  "data": [
    { "id": "...", "title": "Villa Moderne à Tanger", ... },
    ...
  ],
  "pagination": { "totalCount": 5, ... }
}
```

### 7.3 — Se connecter en admin

```bash
curl -X POST https://idriss-villa-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@idrissvilla.com","password":"admin123"}'

# Réponse :
{
  "status": "success",
  "data": {
    "user": { "id": "...", "name": "Admin", "role": "ADMIN" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 8. ÉTAPE 6 — Vérification complète

### 8.1 — Tests backend (terminal)

```bash
export API="https://idriss-villa-api.onrender.com"

# 1. Health check
curl $API/health

# 2. Liste des propriétés
curl $API/api/properties

# 3. Propriétés en vedette
curl $API/api/properties/featured

# 4. Villes disponibles
curl $API/api/properties/filters/cities

# 5. Connexion admin
curl -X POST $API/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@idrissvilla.com","password":"admin123"}'
```

### 8.2 — Tests frontend (navigateur)

Ouvrez votre URL Vercel et testez :

```
Checklist frontend :
────────────────────────────────────────────────────────
[ ] Page d'accueil s'affiche
[ ] Les 5 propriétés vedettes sont visibles
[ ] Navigation vers /properties fonctionne
[ ] Filtres par ville, type, prix fonctionnent
[ ] Cliquer sur une propriété ouvre le détail
[ ] Page /login s'affiche
[ ] Connexion avec admin@idrissvilla.com / admin123 fonctionne
[ ] Après connexion → /admin accessible
[ ] Dashboard admin affiche les statistiques
[ ] Gestion des biens → Liste des 5 propriétés visible
[ ] Cliquer sur le téléphone → ouvre WhatsApp
[ ] Footer WhatsApp, Instagram, Facebook fonctionnent
[ ] Design doré/noir s'affiche correctement
[ ] Site responsive sur mobile
```

### 8.3 — Tableau de bord de vérification

| Composant | URL | Statut attendu |
|-----------|-----|---------------|
| API Health | `https://idriss-villa-api.onrender.com/health` | 200 OK |
| API Properties | `https://idriss-villa-api.onrender.com/api/properties` | 200 + 5 items |
| Frontend | `https://idriss-villa.vercel.app` | Page accueil |
| Admin | `https://idriss-villa.vercel.app/admin` | Redirect /login si pas connecté |

---

## 9. Variables d'environnement — Référence complète

### Backend — Render Environment Variables

```env
# ═══════════════════════════════════════════
# BASE DE DONNÉES (Railway MySQL)
# ═══════════════════════════════════════════
DATABASE_URL=mysql://root:CnKwgwGPNAzhmwJNLHfCOxericNeBENh@gondola.proxy.rlwy.net:53089/railway

# ═══════════════════════════════════════════
# AUTHENTIFICATION JWT
# ═══════════════════════════════════════════
JWT_SECRET=a3f8c2d1e4b7a9f0c3d6e2b5a8f1c4d7e0b3a6f9c2d5e8b1a4f7c0d3e6b9a2f5
JWT_EXPIRES_IN=7d

# ═══════════════════════════════════════════
# SERVEUR
# ═══════════════════════════════════════════
PORT=10000
NODE_ENV=production

# ═══════════════════════════════════════════
# CORS (doit correspondre à l'URL Vercel)
# ═══════════════════════════════════════════
FRONTEND_URL=https://idriss-villa.vercel.app

# ═══════════════════════════════════════════
# ADMIN PAR DÉFAUT (utilisé par prisma:seed)
# ═══════════════════════════════════════════
ADMIN_EMAIL=admin@idrissvilla.com
ADMIN_PASSWORD=admin123
```

### Frontend — Vercel Environment Variables

```env
# ═══════════════════════════════════════════
# API (doit pointer vers Render)
# ═══════════════════════════════════════════
NEXT_PUBLIC_API_URL=https://idriss-villa-api.onrender.com/api

# ═══════════════════════════════════════════
# APPLICATION
# ═══════════════════════════════════════════
NEXT_PUBLIC_APP_NAME=Idriss Villa Style
NEXT_PUBLIC_APP_URL=https://idriss-villa.vercel.app
```

### Local — backend/.env (développement)

```env
DATABASE_URL="mysql://root:oualid@localhost:3306/idrissvilla_db"
JWT_SECRET="a3f8c2d1e4b7a9f0c3d6e2b5a8f1c4d7e0b3a6f9c2d5e8b1a4f7c0d3e6b9a2f5"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
ADMIN_EMAIL="admin@idrissvilla.com"
ADMIN_PASSWORD="admin123"
```

---

## 10. Dépannage

### ❌ Build Render échoue — `Error: Cannot find module`

**Cause** : Le Root Directory n'est pas `backend`

**Solution** :
```
Render → votre service → Settings
Root Directory → backend
Save → Manual Deploy
```

### ❌ `Error: P1001 Can't reach database server`

**Cause** : Prisma ne peut pas atteindre Railway depuis Render

**Solution** :
```bash
# Vérifier que l'URL publique Railway est utilisée (pas l'interne)
DATABASE_URL=mysql://root:xxx@gondola.proxy.rlwy.net:53089/railway
#                              ↑ correcte (publique)

# Et NON :
DATABASE_URL=mysql://root:xxx@mysql.railway.internal:3306/railway
#                              ↑ incorrecte (interne Railway seulement)
```

### ❌ `prisma migrate deploy` échoue au build

**Cause** : Mauvaise version Prisma ou base inaccessible

**Solution** :
```bash
# Tester localement depuis votre PC
cd backend
DATABASE_URL="mysql://root:CnKwgwGPNAzhmwJNLHfCOxericNeBENh@gondola.proxy.rlwy.net:53089/railway" \
npx prisma migrate deploy
```

### ❌ Erreur CORS sur le frontend

**Symptôme** :
```
Access-Control-Allow-Origin blocked
```

**Checklist** :
```
1. Sur Render : FRONTEND_URL = https://votre-app.vercel.app  (sans slash final)
2. Sur Vercel : NEXT_PUBLIC_API_URL = https://idriss-villa-api.onrender.com/api
3. Redéployer Render après modification de FRONTEND_URL
```

### ❌ Page admin redirige vers /login en boucle

**Cause** : Le cookie JWT n'est pas envoyé (CORS credentials)

**Cause possible** : `FRONTEND_URL` incorrecte → CORS bloque les cookies

**Solution** : Corriger `FRONTEND_URL` sur Render (voir ci-dessus)

### ❌ Images ne s'affichent pas en production

**Cause** : Domaine Render non autorisé dans Next.js

**Vérification** dans `frontend/next.config.js` :
```javascript
images: {
  domains: [
    'localhost',
    'images.unsplash.com',
    'idriss-villa-api.onrender.com',   // ← doit être présent
  ],
}
```

### ❌ Upload d'images échoue

**Cause** : Le plan gratuit Render ne persiste pas les fichiers

**Explication** : Render Free utilise un système de fichiers éphémère.
Les fichiers uploadés disparaissent à chaque redéploiement.

**Solution à terme** : Utiliser Cloudinary ou AWS S3 pour le stockage des images.
Pour l'instant, utilisez des URLs Unsplash directement dans les propriétés.

### ❌ L'API répond en 30-60 secondes (première requête)

**Cause** : Render Free met l'API en veille après 15 min d'inactivité.

**Solution** : Configurez [UptimeRobot](https://uptimerobot.com) (gratuit) :
```
Type : HTTP(s)
URL  : https://idriss-villa-api.onrender.com/health
Interval : 5 minutes
```
Cela garde l'API éveillée en permanence.

### ❌ `JWT_SECRET` erreur en production

**Symptôme** : 401 sur toutes les routes protégées

**Vérification** :
```bash
# Le secret doit faire minimum 32 caractères
echo -n "votre-secret" | wc -c   # doit être >= 32

# Générer un nouveau secret si besoin
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 11. Maintenance

### Déployer une mise à jour

```bash
# Modifier votre code
# Puis :
git add .
git commit -m "feat: description de votre changement"
git push origin main

# → Render redéploie automatiquement le backend
# → Vercel redéploie automatiquement le frontend
```

### Voir les logs en temps réel

```
Backend  → Render → votre service → Logs
Frontend → Vercel → votre projet → Deployments → cliquer sur le dernier → View Logs
```

### Ajouter une migration Prisma

```bash
# En local
cd backend

# Créer la migration
npx prisma migrate dev --name ajout_colonne_telephone

# Pousser sur GitHub
git add .
git commit -m "feat: ajouter colonne telephone"
git push

# → Render exécute npx prisma migrate deploy au prochain build
```

### Backup de la base de données

```bash
# Depuis votre PC
mysqldump \
  -u root \
  -pCnKwgwGPNAzhmwJNLHfCOxericNeBENh \
  -h gondola.proxy.rlwy.net \
  -P 53089 \
  --single-transaction \
  railway > backup_$(date +%Y%m%d_%H%M%S).sql

echo "Backup terminé !"
```

### Changer le mot de passe admin en production

1. Connectez-vous sur `https://votre-app.vercel.app/login`
2. Connectez-vous avec `admin@idrissvilla.com` / `admin123`
3. Allez dans le dashboard → Profil → Changer mot de passe

---

## 🎉 Récapitulatif Final

```
VOTRE APPLICATION EST EN LIGNE !
═══════════════════════════════════════════════════════════════

🌐 Frontend   : https://idriss-villa.vercel.app
🔌 Backend    : https://idriss-villa-api.onrender.com
🗄️ Database   : Railway MySQL (gondola.proxy.rlwy.net:53089)

👤 Admin      : admin@idrissvilla.com / admin123
🔑 Admin URL  : https://idriss-villa.vercel.app/admin

═══════════════════════════════════════════════════════════════

EN CAS DE PROBLÈME — Ordre de diagnostic :
1. Logs Render   → problème backend ou migrations
2. Logs Vercel   → problème build frontend
3. Connexion BD  → npx prisma db pull en local
4. Variables env → vérifier FRONTEND_URL et DATABASE_URL
5. CORS          → FRONTEND_URL sans slash final
```
