# Backend Simple - Compta LMB

Backend ultra-simplifié en un seul fichier pour Vercel.

## Structure

```
backend/
├── api/
│   └── index.ts          # Tout le code en un seul fichier
├── prisma/
│   └── schema.prisma     # Schéma Prisma
├── package.json
├── vercel.json           # Configuration Vercel minimale
└── tsconfig.json
```

## Fonctionnalités

- ✅ Authentification (register, login, me)
- ✅ Transactions (CRUD)
- ✅ Prisma pour la base de données
- ✅ JWT pour l'authentification
- ✅ CORS activé

## Configuration Vercel

1. **Root Directory** : `backend`
2. **Build Command** : (automatique via postinstall)
3. **Output Directory** : (vide)

## Variables d'environnement

- `DATABASE_URL` : URL de connexion PostgreSQL (Neon)
- `JWT_SECRET` : Secret pour signer les tokens JWT

## Routes

- `GET /api/health` - Santé de l'API
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Utilisateur connecté (auth requise)
- `GET /api/transactions` - Liste des transactions (auth requise)
- `POST /api/transactions` - Créer une transaction (auth requise)
- `DELETE /api/transactions/:id` - Supprimer une transaction (auth requise)

## Déploiement

Le backend se déploie automatiquement sur Vercel à chaque push sur `main`.

