# Compta LMB - Site de Comptabilité Interne

Application web complète de gestion comptable interne avec authentification et partage des transactions entre tous les utilisateurs.

## 🎨 Design

- **Thème** : Noir et blanc avec image de fond aérienne de Londres
- **Style** : Urbain et moderne avec effets de transparence
- **Interface** : Responsive et optimisée pour la performance

## 🚀 Fonctionnalités

- **Authentification sécurisée** : Inscription et connexion avec JWT
- **Gestion des transactions** : Ajout d'entrées et sorties d'argent
- **Partage commun** : Toutes les transactions sont visibles par tous les utilisateurs authentifiés
- **Statistiques en temps réel** : Solde total, total des entrées/sorties
- **Interface moderne** : Design responsive et intuitif

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn

## 🛠️ Installation

1. **Installer toutes les dépendances** :
```bash
npm run install:all
```

2. **Configurer la base de données** :
```bash
cd backend
cp .env.example .env
# Éditez .env et changez JWT_SECRET par une valeur sécurisée
```

3. **Initialiser la base de données** :
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

## 🚀 Démarrage

**Développement** (lance le backend et le frontend simultanément) :
```bash
npm run dev
```

**Ou séparément** :
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

L'application sera accessible sur :
- Frontend : http://localhost:3000
- Backend API : http://localhost:3001

## 📁 Structure du projet

```
compta-lmb/
├── backend/           # API Express + Prisma
│   ├── src/
│   │   ├── routes/    # Routes API
│   │   ├── middleware/# Middleware d'authentification
│   │   └── server.ts  # Point d'entrée
│   └── prisma/        # Schéma de base de données
├── frontend/          # Application React
│   └── src/
│       ├── components/# Composants React
│       ├── pages/     # Pages de l'application
│       ├── services/  # Services API
│       └── contexts/  # Contextes React (Auth)
└── package.json       # Scripts de gestion du projet
```

## 🔐 Authentification

- Les mots de passe sont hashés avec bcrypt
- Les tokens JWT expirent après 7 jours
- Toutes les routes de transactions nécessitent une authentification

## 💾 Base de données

La base de données SQLite est utilisée par défaut (facile à déployer). Le schéma inclut :
- **User** : Utilisateurs du système
- **Transaction** : Entrées et sorties d'argent (partagées)

## 📝 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Informations utilisateur

### Transactions
- `GET /api/transactions` - Liste des transactions (avec filtres)
- `POST /api/transactions` - Créer une transaction
- `GET /api/transactions/:id` - Détails d'une transaction
- `PUT /api/transactions/:id` - Modifier une transaction
- `DELETE /api/transactions/:id` - Supprimer une transaction
- `GET /api/transactions/stats/summary` - Statistiques

## 🎨 Technologies utilisées

- **Backend** : Node.js, Express, TypeScript, Prisma, SQLite
- **Frontend** : React, TypeScript, Vite, React Router
- **Authentification** : JWT, bcrypt
- **Styling** : CSS moderne avec gradients

## 📦 Build pour production

```bash
npm run build
```

Les fichiers compilés seront dans `backend/dist` et `frontend/dist`.

## 🔧 Commandes utiles

```bash
# Générer le client Prisma
cd backend && npm run prisma:generate

# Ouvrir Prisma Studio (interface graphique pour la DB)
cd backend && npm run prisma:studio

# Créer une nouvelle migration
cd backend && npm run prisma:migrate
```

## 📄 Licence

ISC

