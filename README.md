# 🏡 Idriss Villa Style - Marketplace Immobilier

Un marketplace immobilier moderne et professionnel inspiré du luxe et de l'élégance marocaine.

![Logo](https://via.placeholder.com/200x200/d4902a/0a0a0a?text=IV)

## ✨ Fonctionnalités

### Backend (Node.js + Express + MySQL)
- ✅ Authentification JWT sécurisée
- ✅ CRUD complet des propriétés
- ✅ Upload d'images multiples
- ✅ Filtres avancés (ville, type, prix, surface)
- ✅ Pagination
- ✅ Middleware de protection admin
- ✅ Validation des données
- ✅ Gestion des erreurs globale

### Frontend (Next.js 14 + TypeScript)
- ✅ Design luxueux doré/noir
- ✅ Interface responsive
- ✅ Authentification avec cookies
- ✅ Pages publiques (Home, Properties, Contact)
- ✅ Dashboard Admin complet
- ✅ Gestion des biens (CRUD)
- ✅ Gestion des utilisateurs
- ✅ Upload d'images

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- MySQL 8+
- npm ou yarn

### 1. Cloner le projet

```bash
git clone <repository-url>
cd idriss-villa-style
```

### 2. Configuration Backend

```bash
cd backend

# Installer les dépendances
npm install

# Configuration de la base de données
cp .env.example .env
# Éditer .env avec vos informations MySQL

# Générer le client Prisma
npx prisma generate

# Créer les migrations
npx prisma migrate dev --name init

# Seed la base de données
npm run prisma:seed

# Démarrer le serveur
npm run dev
```

Le backend sera disponible sur `http://localhost:5000`

### 3. Configuration Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Configuration
cp .env.example .env.local
# Éditer .env.local avec l'URL de l'API

# Démarrer le serveur de développement
npm run dev
```

Le frontend sera disponible sur `http://localhost:3000`

## 📁 Structure du Projet

```
idriss-villa-style/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma    # Schéma de la base de données
│   │   └── seed.js          # Données de test
│   ├── src/
│   │   ├── controllers/     # Contrôleurs API
│   │   ├── middleware/      # Middleware (auth, erreurs, upload)
│   │   ├── routes/          # Routes API
│   │   ├── validations/     # Validations express-validator
│   │   └── utils/           # Utilitaires
│   ├── uploads/             # Dossier des images uploadées
│   ├── server.js            # Point d'entrée
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Pages Next.js (App Router)
│   │   ├── components/      # Composants React
│   │   ├── contexts/        # Contextes (Auth)
│   │   ├── hooks/           # Hooks personnalisés
│   │   ├── lib/             # Utilitaires et API
│   │   └── types/           # Types TypeScript
│   ├── public/              # Fichiers statiques
│   └── package.json
│
└── README.md
```

## 🔐 Comptes par défaut

### Admin
- Email: `admin@idrissvilla.com`
- Mot de passe: `admin123`

## 🌐 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Profil utilisateur

### Propriétés
- `GET /api/properties` - Liste des propriétés (avec filtres)
- `GET /api/properties/featured` - Propriétés en vedette
- `GET /api/properties/:id` - Détail d'une propriété
- `POST /api/properties` - Créer une propriété (Admin)
- `PATCH /api/properties/:id` - Modifier une propriété (Admin)
- `DELETE /api/properties/:id` - Supprimer une propriété (Admin)

### Utilisateurs (Admin)
- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/stats/dashboard` - Statistiques dashboard
- `PATCH /api/users/:id/role` - Modifier le rôle
- `DELETE /api/users/:id` - Supprimer un utilisateur

### Upload (Admin)
- `POST /api/upload/image` - Upload une image
- `POST /api/upload/images` - Upload multiple images

## 🎨 Design System

### Couleurs
- **Gold**: `#d4902a` - Couleur principale
- **Dark**: `#0a0a0a` - Fond
- **Dark-800**: `#1a1a1a` - Cartes
- **Dark-700**: `#2a2a2a` - Bordures

### Typographie
- **Titres**: Playfair Display (serif)
- **Corps**: Inter (sans-serif)

## 🚀 Déploiement

### Backend sur Render

1. Créer un compte sur [Render](https://render.com)
2. Créer un nouveau Web Service
3. Connecter votre repository GitHub
4. Configuration:
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command**: `npm start`
5. Ajouter les variables d'environnement
6. Déployer

### Frontend sur Vercel

1. Créer un compte sur [Vercel](https://vercel.com)
2. Importer votre repository GitHub
3. Configuration:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
4. Ajouter les variables d'environnement
5. Déployer

### Base de données MySQL

1. Installer MySQL 8+ sur votre serveur
2. Créer une base de données `idrissvilla_db`
3. Copier l'URL de connexion MySQL : `mysql://user:password@host:3306/idrissvilla_db`
4. L'utiliser dans les variables d'environnement du backend

## 🔒 Sécurité

- Mots de passe hashés avec bcrypt
- JWT pour l'authentification
- Cookies httpOnly et secure
- Rate limiting
- Validation des entrées
- Protection CORS
- Helmet pour les headers de sécurité

## 📝 Scripts utiles

```bash
# Backend
npm run dev          # Démarrer en mode développement
npm start            # Démarrer en mode production
npm run prisma:studio # Ouvrir Prisma Studio

# Frontend
npm run dev          # Démarrer en mode développement
npm run build        # Build pour production
npm start            # Démarrer en mode production
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

Ce projet est sous licence MIT.

---

Développé avec ❤️ par l'équipe Idriss Villa Style
