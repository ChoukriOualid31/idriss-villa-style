# Guide GitHub — Idriss Villa Style (De A à Z)

> Ce guide explique comment publier votre projet sur GitHub étape par étape,
> depuis la création du compte jusqu'au push final prêt pour Render et Vercel.

---

## 📋 Table des matières

1. [Créer un compte GitHub](#1-créer-un-compte-github)
2. [Installer Git sur votre machine](#2-installer-git-sur-votre-machine)
3. [Configurer Git](#3-configurer-git)
4. [Créer le repository sur GitHub](#4-créer-le-repository-sur-github)
5. [Préparer le projet localement](#5-préparer-le-projet-localement)
6. [Initialiser Git dans le projet](#6-initialiser-git-dans-le-projet)
7. [Créer le fichier .gitignore](#7-créer-le-fichier-gitignore)
8. [Premier commit et push](#8-premier-commit-et-push)
9. [Vérifier sur GitHub](#9-vérifier-sur-github)
10. [Workflow quotidien](#10-workflow-quotidien)
11. [Commandes Git essentielles](#11-commandes-git-essentielles)
12. [Dépannage](#12-dépannage)

---

## 1. Créer un compte GitHub

1. Allez sur [github.com](https://github.com)
2. Cliquez sur **Sign up**
3. Remplissez :
   - Username (ex: `idriss-villa`)
   - Email
   - Mot de passe
4. Vérifiez votre email
5. Connectez-vous

---

## 2. Installer Git sur votre machine

### Windows

1. Téléchargez Git : [git-scm.com/download/win](https://git-scm.com/download/win)
2. Installez avec les options par défaut
3. Vérifiez l'installation :

```bash
git --version
# Doit afficher : git version 2.x.x
```

### macOS

```bash
# Avec Homebrew
brew install git

# Vérifier
git --version
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install git -y

# Vérifier
git --version
```

---

## 3. Configurer Git

Ces informations apparaîtront dans chaque commit. À faire **une seule fois** sur votre machine.

```bash
# Remplacez par vos vraies informations
git config --global user.name "Votre Nom"
git config --global user.email "votre@email.com"

# Définir la branche principale en 'main' (standard actuel)
git config --global init.defaultBranch main

# Vérifier la configuration
git config --list
```

Résultat attendu :
```
user.name=Votre Nom
user.email=votre@email.com
init.defaultBranch=main
```

---

## 4. Créer le repository sur GitHub

1. Connectez-vous à [github.com](https://github.com)
2. Cliquez sur le **+** en haut à droite → **New repository**
3. Remplissez :

| Champ | Valeur |
|-------|--------|
| Repository name | `idriss-villa-style` |
| Description | `Marketplace immobilier moderne - Idriss Villa Style` |
| Visibility | `Public` (ou `Private`) |
| Initialize | **NE PAS cocher** (on a déjà le code) |

4. Cliquez sur **Create repository**
5. Copiez l'URL affichée, elle ressemble à :

```
https://github.com/VOTRE-USERNAME/idriss-villa-style.git
```

> ⚠️ Gardez cette URL, vous en aurez besoin à l'étape 8.

---

## 5. Préparer le projet localement

Ouvrez un terminal et naviguez vers votre projet :

```bash
cd "c:/khadma/Kimi_Agent_Marketplace immobilier complet/idriss-villa-style"

# Vérifier que vous êtes au bon endroit
ls
# Doit afficher : backend  frontend  README.md  DEPLOYMENT.md  ...
```

---

## 6. Initialiser Git dans le projet

```bash
# Initialiser un nouveau dépôt Git
git init

# Vérifier le statut (tous les fichiers apparaissent en rouge = non suivis)
git status
```

---

## 7. Créer le fichier .gitignore

> Le `.gitignore` empêche d'envoyer les fichiers sensibles ou inutiles sur GitHub
> (mots de passe, node_modules, etc.)

Créez le fichier à la **racine du projet** :

```bash
# Contenu du .gitignore
cat > .gitignore << 'EOF'
# ===========================
# VARIABLES D'ENVIRONNEMENT
# Ne JAMAIS envoyer sur GitHub !
# ===========================
.env
.env.local
.env.production
.env.development
backend/.env
frontend/.env
frontend/.env.local

# ===========================
# DÉPENDANCES NODE.JS
# ===========================
node_modules/
backend/node_modules/
frontend/node_modules/

# ===========================
# BUILD NEXT.JS
# ===========================
frontend/.next/
frontend/out/
frontend/build/

# ===========================
# UPLOADS (images locales)
# ===========================
backend/uploads/properties/

# ===========================
# LOGS
# ===========================
*.log
npm-debug.log*
yarn-error.log

# ===========================
# SYSTÈME D'EXPLOITATION
# ===========================
.DS_Store
Thumbs.db
desktop.ini

# ===========================
# ÉDITEURS
# ===========================
.vscode/settings.json
.idea/
*.swp
*.swo

# ===========================
# PRISMA
# ===========================
backend/prisma/migrations/dev.db
EOF
```

Vérifiez le fichier créé :

```bash
cat .gitignore
```

---

## 8. Premier commit et push

### Étape 8.1 — Ajouter tous les fichiers

```bash
# Ajouter tous les fichiers au suivi Git
git add .

# Vérifier ce qui sera envoyé (fichiers en vert = OK)
git status
```

> ✅ Vous devez voir `backend/`, `frontend/`, `README.md`, etc.
> ❌ Vous **ne devez PAS** voir `.env`, `node_modules/`, `.next/`

### Étape 8.2 — Créer le premier commit

```bash
git commit -m "feat: initial commit - Idriss Villa Style marketplace immobilier"
```

### Étape 8.3 — Lier au repository GitHub

```bash
# Remplacez VOTRE-USERNAME par votre nom d'utilisateur GitHub
git remote add origin https://github.com/VOTRE-USERNAME/idriss-villa-style.git

# Vérifier la liaison
git remote -v
# Doit afficher :
# origin  https://github.com/VOTRE-USERNAME/idriss-villa-style.git (fetch)
# origin  https://github.com/VOTRE-USERNAME/idriss-villa-style.git (push)
```

### Étape 8.4 — Envoyer le code sur GitHub

```bash
# Pousser sur la branche main
git push -u origin main
```

GitHub va vous demander vos identifiants :
- **Username** : votre nom d'utilisateur GitHub
- **Password** : votre **token** GitHub (pas votre mot de passe !)

> **Créer un token GitHub** :
> 1. GitHub → Votre avatar → **Settings**
> 2. **Developer settings** → **Personal access tokens** → **Tokens (classic)**
> 3. **Generate new token**
> 4. Cochez : `repo`, `workflow`
> 5. **Generate token** → Copiez le token (visible une seule fois !)
> 6. Utilisez ce token comme mot de passe

---

## 9. Vérifier sur GitHub

1. Allez sur `https://github.com/VOTRE-USERNAME/idriss-villa-style`
2. Vous devez voir tous vos fichiers :

```
📁 backend/
📁 frontend/
📄 .gitignore
📄 DEPLOYMENT.md
📄 GITHUB.md
📄 QUICKSTART.md
📄 README.md
```

3. Vérifiez que ces fichiers **n'apparaissent PAS** :
   - ❌ `.env`
   - ❌ `node_modules/`
   - ❌ `.next/`
   - ❌ `uploads/`

---

## 10. Workflow quotidien

Après le premier push, voici les commandes à utiliser chaque jour :

### Sauvegarder vos modifications

```bash
# 1. Voir ce qui a changé
git status

# 2. Voir le détail des modifications
git diff

# 3. Ajouter les fichiers modifiés
git add .
# Ou ajouter un fichier spécifique :
git add frontend/src/components/layout/Footer.tsx

# 4. Créer un commit avec un message descriptif
git commit -m "fix: corriger le lien WhatsApp dans le footer"

# 5. Envoyer sur GitHub (Render et Vercel se redéploient automatiquement)
git push
```

### Conventions de messages de commit

```bash
# Nouvelle fonctionnalité
git commit -m "feat: ajouter page de comparaison de biens"

# Correction de bug
git commit -m "fix: corriger la pagination sur mobile"

# Modification de style
git commit -m "style: mettre à jour les couleurs du header"

# Documentation
git commit -m "docs: mettre à jour le guide de déploiement"

# Refactorisation
git commit -m "refactor: simplifier le composant PropertyCard"
```

---

## 11. Commandes Git essentielles

### Voir l'état du projet

```bash
# Statut des fichiers (modifiés, ajoutés, supprimés)
git status

# Historique des commits
git log --oneline
# Exemple de sortie :
# a3f8c2d feat: ajouter page contact
# b7e1d4f fix: corriger bug upload images
# c2a9f6e feat: initial commit

# Voir les modifications non enregistrées
git diff
```

### Gérer les branches

```bash
# Voir les branches existantes
git branch

# Créer une nouvelle branche
git checkout -b feature/nouvelle-fonctionnalite

# Changer de branche
git checkout main

# Fusionner une branche dans main
git checkout main
git merge feature/nouvelle-fonctionnalite

# Supprimer une branche
git branch -d feature/nouvelle-fonctionnalite
```

### Récupérer les changements

```bash
# Récupérer les derniers changements de GitHub
git pull

# Récupérer sans fusionner (pour voir d'abord)
git fetch origin
```

### Annuler des modifications

```bash
# Annuler les modifications d'un fichier non encore committé
git checkout -- frontend/src/components/layout/Footer.tsx

# Annuler le dernier commit (garde les modifications)
git reset --soft HEAD~1

# Voir quel commit a modifié une ligne
git blame backend/server.js
```

---

## 12. Dépannage

### Erreur : `fatal: not a git repository`

```bash
# Solution : initialiser Git
git init
```

### Erreur : `remote origin already exists`

```bash
# Solution : supprimer l'ancien remote et en ajouter un nouveau
git remote remove origin
git remote add origin https://github.com/VOTRE-USERNAME/idriss-villa-style.git
```

### Erreur : `Authentication failed`

```bash
# Le mot de passe GitHub n'est plus accepté, utilisez un token
# Créez un token sur : GitHub → Settings → Developer settings → Personal access tokens

# Mettre à jour l'URL avec le token directement (méthode simple)
git remote set-url origin https://VOTRE-TOKEN@github.com/VOTRE-USERNAME/idriss-villa-style.git
```

### Erreur : `refusing to merge unrelated histories`

```bash
# Si vous avez initialisé le repo GitHub avec un README
git pull origin main --allow-unrelated-histories
git push origin main
```

### Erreur : `.env envoyé par accident sur GitHub

```bash
# 1. Supprimer le fichier du suivi Git (mais garder en local)
git rm --cached backend/.env
git rm --cached frontend/.env.local

# 2. Ajouter au .gitignore si pas déjà fait
echo "backend/.env" >> .gitignore
echo "frontend/.env.local" >> .gitignore

# 3. Committer le changement
git add .gitignore
git commit -m "fix: supprimer .env du suivi Git"
git push

# 4. IMPORTANT : Changez tous vos secrets (JWT_SECRET, mots de passe DB)
#    car ils sont maintenant dans l'historique GitHub !
```

### Annuler le dernier push (urgence)

```bash
# ⚠️ Uniquement si personne d'autre ne travaille sur le projet
git revert HEAD
git push
```

---

## Récapitulatif — Commandes à retenir

```bash
# ---- PREMIÈRE FOIS ----
git init                                    # Initialiser Git
git add .                                   # Ajouter tous les fichiers
git commit -m "feat: initial commit"        # Premier commit
git remote add origin https://github.com/... # Lier à GitHub
git push -u origin main                     # Premier push

# ---- CHAQUE JOUR ----
git status                                  # Voir les changements
git add .                                   # Ajouter les changements
git commit -m "votre message"              # Sauvegarder
git push                                    # Envoyer sur GitHub
```

---

> **Rappel important** : Chaque `git push` sur la branche `main` déclenche
> automatiquement un redéploiement sur **Render** (backend) et **Vercel** (frontend).
> Vous n'avez rien d'autre à faire !
