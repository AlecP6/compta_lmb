# Guide d'Installation - Compta LMB

## 📋 Prérequis

Avant de commencer, vous devez installer **Node.js** (version 18 ou supérieure).

### Installer Node.js

1. **Téléchargez Node.js** :
   - Allez sur https://nodejs.org/
   - Téléchargez la version LTS (Long Term Support)
   - Choisissez l'installateur Windows (.msi)

2. **Installez Node.js** :
   - Exécutez le fichier téléchargé
   - Suivez l'assistant d'installation
   - **Important** : Cochez l'option "Add to PATH" si elle est proposée

3. **Vérifiez l'installation** :
   - Ouvrez un nouveau terminal PowerShell
   - Tapez : `node --version`
   - Vous devriez voir quelque chose comme : `v20.x.x`
   - Tapez : `npm --version`
   - Vous devriez voir quelque chose comme : `10.x.x`

## 🚀 Une fois Node.js installé

Revenez dans ce dossier et exécutez :

```bash
# 1. Installer toutes les dépendances
npm run install:all

# 2. Configurer le backend
cd backend
copy env.example .env
# Éditez .env et changez JWT_SECRET par une valeur sécurisée (ex: "mon-secret-super-securise-123456789")

# 3. Initialiser la base de données
npm run prisma:generate
npm run prisma:migrate
# Lorsqu'on vous demande un nom de migration, tapez : init

# 4. Revenir à la racine et démarrer
cd ..
npm run dev
```

## ✅ Vérification

Si tout fonctionne :
- Le backend sera sur : http://localhost:3001
- Le frontend sera sur : http://localhost:3000
- Ouvrez votre navigateur sur http://localhost:3000

## 🆘 Problèmes courants

### "npm n'est pas reconnu"
- Redémarrez votre terminal après l'installation de Node.js
- Vérifiez que Node.js est bien dans le PATH

### "Cannot find module '@prisma/client'"
```bash
cd backend
npm run prisma:generate
```

### Erreur de base de données
```bash
cd backend
npm run prisma:migrate
```

