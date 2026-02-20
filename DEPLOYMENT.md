# Guide de Déploiement — Idriss Villa Style

> Stack : **Node.js + Prisma + MySQL** (Backend) · **Next.js 14** (Frontend)
> Hébergement : **Render** (API) · **Vercel** (Frontend) · **MySQL Cloud** (Base de données)

---

## 📋 Table des matières

1. [Architecture de production](#1-architecture-de-production)
2. [Prérequis](#2-prérequis)
3. [Pourquoi MySQL et non PostgreSQL ?](#3-pourquoi-mysql-et-non-postgresql-)
4. [Étape 1 — Base de données MySQL](#4-étape-1--base-de-données-mysql)
5. [Étape 2 — Déploiement Backend (Render)](#5-étape-2--déploiement-backend-render)
6. [Étape 3 — Déploiement Frontend (Vercel)](#6-étape-3--déploiement-frontend-vercel)
7. [Étape 4 — Lier Backend et Frontend](#7-étape-4--lier-backend-et-frontend)
8. [Vérification complète](#8-vérification-complète)
9. [Dépannage MySQL](#9-dépannage-mysql)
10. [Maintenance](#10-maintenance)

---

## 1. Architecture de production

```
┌─────────────────────────────────────────────────────────┐
│                     UTILISATEUR                         │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS
          ┌────────────▼────────────┐
          │   VERCEL (Frontend)     │
          │   Next.js 14 + React    │
          │   idriss-villa.vercel.app│
          └────────────┬────────────┘
                       │ API REST (HTTPS)
          ┌────────────▼────────────┐
          │   RENDER (Backend)      │
          │   Node.js + Express     │
          │   idriss-villa-api      │
          │   .onrender.com         │
          └────────────┬────────────┘
                       │ Prisma ORM
          ┌────────────▼────────────┐
          │   MySQL 8 (Cloud)       │
          │   PlanetScale / Railway │
          │   Port 3306             │
          └─────────────────────────┘
```

**Flux de déploiement recommandé :**
```
GitHub → Render (auto-deploy) → MySQL (migrations auto)
GitHub → Vercel (auto-deploy)
```

---

## 2. Prérequis

### Comptes nécessaires

| Service | Utilisation | Coût |
|---------|-------------|------|
| [GitHub](https://github.com) | Hébergement du code source | Gratuit |
| [Render](https://render.com) | Hébergement du backend Node.js | Gratuit |
| [Vercel](https://vercel.com) | Hébergement du frontend Next.js | Gratuit |
| [Railway](https://railway.app) | Base de données MySQL managée | ~5$/mois |

> **Conseil junior** : Railway est recommandé pour MySQL managé car il est simple à configurer et supporte nativement MySQL 8.

### Outils locaux nécessaires

```bash
# Vérifier Node.js (minimum v18)
node --version   # doit afficher v18.x.x ou supérieur

# Vérifier npm
npm --version

# Vérifier Prisma CLI
npx prisma --version
```

### Checklist avant de commencer

- [ ] Code pushé sur GitHub (branche `main`)
- [ ] Compte Render créé et connecté à GitHub
- [ ] Compte Vercel créé et connecté à GitHub
- [ ] Base de données MySQL cloud créée (Railway ou autre)
- [ ] URL de connexion MySQL en main

---

## 3. Pourquoi MySQL et non PostgreSQL ?

Ce projet utilise **MySQL** comme base de données. Voici les différences clés pour les développeurs qui voient souvent PostgreSQL dans les tutoriels :

### Différences de configuration Prisma

```prisma
// ✅ Notre projet — MySQL
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// ❌ Ne pas utiliser — PostgreSQL
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Différences d'URL de connexion

```bash
# ✅ MySQL (notre projet)
DATABASE_URL="mysql://user:password@host:3306/idrissvilla_db"

# ❌ PostgreSQL (ne pas utiliser)
DATABASE_URL="postgresql://user:password@host:5432/database"
```

### Points importants

| Aspect | MySQL (notre projet) | PostgreSQL |
|--------|---------------------|------------|
| Port | **3306** | 5432 |
| URL prefix | **`mysql://`** | `postgresql://` |
| Prisma provider | **`"mysql"`** | `"postgresql"` |
| Commande backup | **`mysqldump`** | `pg_dump` |
| Types JSON | Supporté (Prisma) | Supporté (natif) |

> **Important** : Ne jamais mélanger les deux. Si `schema.prisma` dit `mysql`, toutes vos URLs doivent commencer par `mysql://`.

---

## 4. Étape 1 — Base de données MySQL

### Option A : Railway (Recommandé pour débutants)

1. Allez sur [railway.app](https://railway.app) → **New Project**
2. Cliquez sur **Add a service** → **Database** → **MySQL**
3. Attendez ~30 secondes que la base soit créée
4. Cliquez sur votre service MySQL → onglet **Variables**
5. Copiez la valeur de `DATABASE_URL` — elle ressemble à :

```
mysql://root:AbCdEfGh123@containers-us-west-12.railway.app:6543/railway
```

### Option B : VPS avec MySQL installé

Si vous avez votre propre serveur, connectez-vous et exécutez :

```sql
-- Créer la base de données avec encodage UTF-8 complet (emojis inclus)
CREATE DATABASE idrissvilla_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Créer un utilisateur dédié (ne pas utiliser root en production)
CREATE USER 'idrissuser'@'%' IDENTIFIED BY 'VotreMotDePasseSecure123!';

-- Accorder les droits uniquement sur notre base
GRANT ALL PRIVILEGES ON idrissvilla_db.* TO 'idrissuser'@'%';

-- Appliquer les changements
FLUSH PRIVILEGES;

-- Vérifier
SHOW GRANTS FOR 'idrissuser'@'%';
```

Puis ouvrez le port MySQL dans le pare-feu :

```bash
sudo ufw allow 3306/tcp
sudo ufw reload
sudo ufw status
```

### Vérifier la configuration Prisma

Confirmez que `backend/prisma/schema.prisma` contient bien :

```prisma
datasource db {
  provider = "mysql"    ← doit être "mysql"
  url      = env("DATABASE_URL")
}
```

### Format de l'URL selon l'hébergeur

```bash
# VPS standard
mysql://idrissuser:password@IP_SERVEUR:3306/idrissvilla_db

# Railway
mysql://root:password@containers-us-west-XX.railway.app:PORT/railway

# PlanetScale (SSL requis)
mysql://user:password@host.psdb.cloud/idrissvilla_db?sslaccept=strict
```

---

## 5. Étape 2 — Déploiement Backend (Render)

### Fichiers déjà configurés dans le projet

**`backend/package.json`** — scripts de build :
```json
{
  "scripts": {
    "start": "node server.js",
    "build": "npx prisma generate && npx prisma migrate deploy",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**`backend/render.yaml`** — configuration Render automatique :
```yaml
services:
  - type: web
    name: idriss-villa-api
    env: node
    region: frankfurt
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: JWT_EXPIRES_IN
        value: 7d
      - key: FRONTEND_URL
        sync: false
      - key: PORT
        value: 10000
```

> **Ce que fait le build** :
> `npm install` → installe les dépendances
> `npx prisma generate` → génère le client Prisma pour MySQL
> `npx prisma migrate deploy` → applique les migrations en base de données

### Créer le service sur Render

1. Connectez-vous à [render.com](https://render.com)
2. **New** → **Web Service**
3. Connectez votre repository GitHub → sélectionnez `idriss-villa-style`
4. Remplissez la configuration :

| Champ | Valeur |
|-------|--------|
| Name | `idriss-villa-api` |
| Environment | `Node` |
| Region | `Frankfurt (EU)` |
| Branch | `main` |
| Root Directory | `backend` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Plan | `Free` |

5. Cliquez sur **Advanced** → ajoutez les variables d'environnement :

| Variable | Valeur | Obligatoire |
|----------|--------|-------------|
| `NODE_ENV` | `production` | ✅ |
| `DATABASE_URL` | `mysql://user:pass@host:3306/idrissvilla_db` | ✅ |
| `JWT_SECRET` | *(généré ci-dessous)* | ✅ |
| `JWT_EXPIRES_IN` | `7d` | ✅ |
| `FRONTEND_URL` | `https://votre-app.vercel.app` | ✅ |
| `PORT` | `10000` | ✅ |

**Générer un JWT_SECRET sécurisé :**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Exemple de sortie : a3f8c2d1e4b7a9f0c3d6e2b5a8f1c4d7e0b3a6f9c2d5e8b1a4f7c0d3e6b9a2f
```

6. Cliquez sur **Create Web Service** → attendez 3-5 minutes

### Vérifier le backend

```bash
curl https://idriss-villa-api.onrender.com/health
```

Réponse attendue :
```json
{
  "status": "success",
  "message": "API Idriss Villa Style is running",
  "environment": "production"
}
```

---

## 6. Étape 3 — Déploiement Frontend (Vercel)

### Fichiers déjà configurés dans le projet

**`frontend/next.config.js`** :
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'images.unsplash.com', 'idriss-villa-api.onrender.com'],
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/:path*`,
      },
    ];
  },
};
module.exports = nextConfig;
```

**`frontend/vercel.json`** :
```json
{
  "version": 2,
  "builds": [{ "src": "package.json", "use": "@vercel/next" }]
}
```

### Déployer sur Vercel

1. Connectez-vous à [vercel.com](https://vercel.com)
2. **Add New Project** → importez votre repo GitHub
3. Configuration :

| Champ | Valeur |
|-------|--------|
| Framework Preset | `Next.js` |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `.next` |

4. Variables d'environnement :

| Variable | Valeur |
|----------|--------|
| `NEXT_PUBLIC_API_URL` | `https://idriss-villa-api.onrender.com/api` |
| `NEXT_PUBLIC_APP_URL` | `https://votre-app.vercel.app` |
| `NEXT_PUBLIC_APP_NAME` | `Idriss Villa Style` |

5. Cliquez sur **Deploy** → attendez 2-3 minutes

---

## 7. Étape 4 — Lier Backend et Frontend

Une fois les deux déployés, vous devez relier les URLs :

### Sur Render (backend)

1. Dashboard → votre service `idriss-villa-api`
2. Onglet **Environment**
3. Mettez à jour `FRONTEND_URL` avec votre vraie URL Vercel :

```
FRONTEND_URL=https://idriss-villa-XXXXXX.vercel.app
```

> ⚠️ **Attention** : Pas de slash `/` à la fin, sinon les requêtes CORS échouent.

4. **Save Changes** → Render redéploie automatiquement

### Sur Vercel (frontend)

1. Dashboard → votre projet → **Settings** → **Environment Variables**
2. Mettez à jour `NEXT_PUBLIC_API_URL` avec votre vraie URL Render :

```
NEXT_PUBLIC_API_URL=https://idriss-villa-api.onrender.com/api
```

3. **Redeploy** depuis l'onglet Deployments

---

## 8. Vérification complète

### Checklist de validation

```bash
# 1. Vérifier que l'API répond
curl https://idriss-villa-api.onrender.com/health

# 2. Vérifier que les propriétés s'affichent
curl https://idriss-villa-api.onrender.com/api/properties

# 3. Tester la connexion admin
curl -X POST https://idriss-villa-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@idrissvilla.com","password":"admin123"}'
```

### Tests manuels dans le navigateur

- [ ] Page d'accueil affiche les propriétés vedettes
- [ ] Page `/properties` affiche la liste avec filtres
- [ ] Connexion admin sur `/login` fonctionne
- [ ] Dashboard `/admin` accessible après connexion
- [ ] Ajout d'une propriété avec images fonctionne
- [ ] Déconnexion fonctionne

### Comptes par défaut

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | `admin@idrissvilla.com` | `admin123` |

> **Important** : Changez ce mot de passe en production via le dashboard admin !

---

## 9. Dépannage MySQL

### Erreur : `Can't connect to MySQL server`

**Cause** : Le serveur MySQL n'accepte pas les connexions externes.

```bash
# 1. Vérifier que MySQL écoute sur toutes les interfaces
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
# Changer : bind-address = 127.0.0.1
# Par    : bind-address = 0.0.0.0

# 2. Redémarrer MySQL
sudo systemctl restart mysql

# 3. Vérifier le port
sudo netstat -tlnp | grep 3306

# 4. Tester depuis votre machine locale
mysql -u idrissuser -p -h VOTRE_IP -P 3306 idrissvilla_db
```

### Erreur : `Access denied for user`

**Cause** : L'utilisateur MySQL n'a pas les bons droits ou le mauvais host.

```sql
-- Vérifier les droits actuels
SHOW GRANTS FOR 'idrissuser'@'%';

-- Si l'utilisateur n'existe pas avec '%' (toutes IPs)
DROP USER IF EXISTS 'idrissuser'@'localhost';
CREATE USER 'idrissuser'@'%' IDENTIFIED BY 'VotreMotDePasse';
GRANT ALL PRIVILEGES ON idrissvilla_db.* TO 'idrissuser'@'%';
FLUSH PRIVILEGES;
```

### Erreur : Migrations Prisma échouent au build

**Cause** : DATABASE_URL incorrecte ou base de données inaccessible depuis Render.

```bash
# Vérifier localement avant de pousser
cd backend
DATABASE_URL="mysql://..." npx prisma migrate deploy

# Si erreur de shadow database (MySQL ne supporte pas les shadow DB)
# Ajouter dans schema.prisma :
datasource db {
  provider          = "mysql"
  url               = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL") # Optionnel pour MySQL
}
```

> **Note MySQL** : Contrairement à PostgreSQL, Prisma avec MySQL ne nécessite pas de `shadowDatabaseUrl` pour `migrate deploy` en production. C'est uniquement nécessaire pour `migrate dev` en local si votre utilisateur n'a pas les droits `CREATE DATABASE`.

### Erreur : CORS bloqué

**Symptôme** : `Access-Control-Allow-Origin` dans la console navigateur.

**Checklist** :
```bash
# 1. FRONTEND_URL sur Render = URL Vercel exacte (sans slash final)
FRONTEND_URL=https://idriss-villa.vercel.app    ✅
FRONTEND_URL=https://idriss-villa.vercel.app/   ❌

# 2. NEXT_PUBLIC_API_URL sur Vercel = URL Render avec /api
NEXT_PUBLIC_API_URL=https://idriss-villa-api.onrender.com/api    ✅
NEXT_PUBLIC_API_URL=https://idriss-villa-api.onrender.com        ❌
```

### Erreur : Images ne s'affichent pas

**Cause** : Domaine de l'API non autorisé dans Next.js.

```javascript
// frontend/next.config.js — ajouter votre domaine Render
images: {
  domains: [
    'localhost',
    'images.unsplash.com',
    'idriss-villa-api.onrender.com',  // ← domaine Render
  ],
}
```

### Erreur : JWT invalide ou 401 partout

```bash
# Générer un nouveau secret fort (minimum 32 caractères)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Vérifier la longueur de votre secret actuel
echo -n "votre-secret" | wc -c   # doit être >= 32
```

### API lente (30-60 sec) au premier appel

**Cause** : Render Free met le service en veille après 15 min sans trafic.

**Solution** : Configurez [UptimeRobot](https://uptimerobot.com) (gratuit) :
1. Créez un monitor **HTTP(s)**
2. URL : `https://idriss-villa-api.onrender.com/health`
3. Intervalle : **5 minutes**

---

## 10. Maintenance

### Déploiement continu (automatique)

```
Développeur → git push origin main → GitHub
                                        ↓
                              Render (backend) ← auto-deploy
                              Vercel (frontend) ← auto-deploy
```

Aucune action manuelle requise après le premier déploiement.

### Backup MySQL

```bash
# Créer un backup horodaté
mysqldump \
  -u idrissuser \
  -p \
  -h votre-host \
  --single-transaction \
  --routines \
  --triggers \
  idrissvilla_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Compresser le backup
gzip backup_*.sql

# Restaurer depuis un backup
gunzip < backup_20240101_120000.sql.gz | \
  mysql -u idrissuser -p -h votre-host idrissvilla_db
```

### Ajouter de nouvelles migrations Prisma

```bash
# En local — créer et appliquer une migration
cd backend
npx prisma migrate dev --name nom_de_la_migration

# Pousser sur GitHub → Render applique automatiquement via :
# "npx prisma migrate deploy" dans le script build
```

### Monitoring recommandé

| Outil | Usage | Coût |
|-------|-------|------|
| [UptimeRobot](https://uptimerobot.com) | Monitoring uptime + alertes email | Gratuit |
| Render Dashboard | Logs temps réel, CPU, RAM | Inclus |
| Vercel Analytics | Performances frontend | Gratuit |

---

## 🎉 Récapitulatif final

| Composant | URL | Statut |
|-----------|-----|--------|
| Frontend | `https://votre-app.vercel.app` | Vercel |
| Backend API | `https://idriss-villa-api.onrender.com` | Render |
| Admin | `https://votre-app.vercel.app/admin` | Vercel |
| Base de données | MySQL Cloud (Railway/VPS) | Port 3306 |

**En cas de problème** : Vérifiez toujours dans cet ordre :
1. Les logs Render (onglet Logs)
2. La connexion MySQL (`DATABASE_URL` correcte ?)
3. Les variables d'environnement (CORS, JWT)
4. La console navigateur (erreurs frontend)
