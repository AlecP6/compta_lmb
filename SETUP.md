# Guide de Configuration Rapide

## 🚀 Installation en 3 étapes

### 1. Installer les dépendances

```bash
npm run install:all
```

### 2. Configurer le backend

Créez le fichier `backend/.env` à partir de `backend/env.example` :

```bash
cd backend
copy env.example .env
```

**Important** : Modifiez `JWT_SECRET` dans `backend/.env` avec une valeur sécurisée aléatoire (au moins 32 caractères).

### 3. Initialiser la base de données

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

Lors de la première migration, Prisma vous demandera un nom. Vous pouvez utiliser : `init`

## ✅ Démarrer l'application

```bash
# Depuis la racine du projet
npm run dev
```

Cela lancera :
- Le backend sur http://localhost:3001
- Le frontend sur http://localhost:3000

## 📝 Première utilisation

1. Ouvrez http://localhost:3000 dans votre navigateur
2. Cliquez sur "S'inscrire" pour créer votre premier compte
3. Connectez-vous avec vos identifiants
4. Commencez à ajouter des transactions !

## 🔧 Dépannage

### Erreur "Cannot find module '@prisma/client'"
```bash
cd backend
npm run prisma:generate
```

### Erreur "Database not found"
```bash
cd backend
npm run prisma:migrate
```

### Le backend ne démarre pas
Vérifiez que le fichier `backend/.env` existe et contient `JWT_SECRET`.

