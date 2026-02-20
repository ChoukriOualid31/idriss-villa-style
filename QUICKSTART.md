# Démarrage Rapide - Idriss Villa Style

## 🚀 En 5 minutes

### 1. Backend (Terminal 1)

```bash
cd backend
npm install

# Copier et éditer le fichier .env
cp .env.example .env
# Éditer .env avec vos informations

# Base de données
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed

# Démarrer
npm run dev
```

Backend disponible sur: `http://localhost:5000`

### 2. Frontend (Terminal 2)

```bash
cd frontend
npm install

# Copier et éditer le fichier .env
cp .env.example .env.local

# Démarrer
npm run dev
```

Frontend disponible sur: `http://localhost:3000`

---

## 🔑 Accès

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | `admin@idrissvilla.com` | `admin123` |

---

## 📁 Structure des fichiers importants

```
backend/
├── .env                    # Configuration (à créer)
├── server.js               # Point d'entrée
├── prisma/
│   └── schema.prisma       # Modèles de données
└── src/
    ├── routes/             # Routes API
    ├── controllers/        # Logique métier
    └── middleware/         # Auth, upload, erreurs

frontend/
├── .env.local              # Configuration (à créer)
├── src/
│   ├── app/                # Pages Next.js
│   ├── components/         # Composants React
│   ├── contexts/           # Contexte d'authentification
│   └── lib/
│       └── api.ts          # Client API
```

---

## 🛠 Commandes utiles

### Backend
```bash
npm run dev              # Démarrer en dev
npm start                # Démarrer en prod
npx prisma studio        # Ouvrir Prisma Studio
npx prisma migrate dev   # Nouvelle migration
npm run prisma:seed      # Remplir la BDD
```

### Frontend
```bash
npm run dev              # Démarrer en dev
npm run build            # Build pour prod
npm start                # Démarrer en prod
```

---

## 🔧 Configuration .env

### Backend (.env)
```env
DATABASE_URL="mysql://root:password@localhost:3306/idrissvilla_db"
JWT_SECRET="votre-super-secret-jwt-min-32-caracteres"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Idriss Villa Style
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🐛 Problèmes courants

### Erreur de connexion MySQL
```bash
# Vérifier que MySQL est démarré
sudo service mysql status

# Créer la base de données
mysql -u root -p -e "CREATE DATABASE idrissvilla_db;"
```

### Erreur Prisma
```bash
# Régénérer le client
npx prisma generate

# Reset complet (attention: perd les données)
npx prisma migrate reset
```

### Port déjà utilisé
```bash
# Trouver le processus
lsof -i :5000

# Tuer le processus
kill -9 <PID>
```

---

## 📚 Documentation complète

- [README.md](README.md) - Documentation complète
- [DEPLOYMENT.md](DEPLOYMENT.md) - Guide de déploiement

---

Besoin d'aide ? Contactez-nous !
