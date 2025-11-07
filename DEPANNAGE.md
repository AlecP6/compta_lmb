# Guide de Dépannage - Compta LMB

## 🔍 Problèmes courants et solutions

### 1. Le site ne s'ouvre pas / Page blanche

**Solution :**
```bash
# Arrêtez tous les processus Node.js
# Puis redémarrez depuis la racine :
cd "c:\Users\pxksa\Documents\Compta LMB"
npm run dev
```

### 2. Erreur "Cannot connect to server"

**Vérifications :**
- Le backend doit tourner sur le port 3001
- Le frontend doit tourner sur le port 3000
- Vérifiez que les ports ne sont pas déjà utilisés

**Solution :**
```bash
# Vérifier les ports
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Si occupés, tuez les processus ou changez les ports
```

### 3. Erreur dans la console du navigateur

**Ouvrez la console (F12) et vérifiez :**
- Erreurs JavaScript
- Erreurs de réseau (onglet Network)
- Erreurs CORS

### 4. Le backend ne démarre pas

**Vérifications :**
```bash
cd backend
# Vérifiez que .env existe
dir .env

# Vérifiez que la base de données existe
dir prisma\dev.db

# Si manquant, recréez :
npm run prisma:generate
npm run prisma:migrate
```

### 5. Le frontend ne compile pas

**Solution :**
```bash
cd frontend
# Supprimez node_modules et réinstallez
rmdir /s /q node_modules
npm install
npm run dev
```

### 6. Erreur "Module not found"

**Solution :**
```bash
# Réinstallez toutes les dépendances
cd "c:\Users\pxksa\Documents\Compta LMB"
npm run install:all
```

## 🚀 Démarrage manuel (si npm run dev ne fonctionne pas)

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```

## 📝 Vérification rapide

1. **Backend accessible ?** : http://localhost:3001/api/health
2. **Frontend accessible ?** : http://localhost:3000
3. **Base de données ?** : Vérifiez que `backend/prisma/dev.db` existe

## 🆘 Si rien ne fonctionne

1. Fermez tous les terminaux
2. Redémarrez votre éditeur
3. Supprimez `node_modules` dans backend et frontend
4. Réinstallez : `npm run install:all`
5. Redémarrez : `npm run dev`

