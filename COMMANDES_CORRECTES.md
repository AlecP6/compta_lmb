# Commandes correctes selon votre emplacement

## 📍 Vérifier où vous êtes

Tapez dans PowerShell :
```powershell
pwd
```

## 🔧 Si vous êtes dans "Compta LMB" (racine du projet)

Exécutez ces commandes :
```powershell
$env:PATH += ";C:\Program Files\nodejs"
cd backend
npm run prisma:generate
npm run setup:admin
cd ..
npm run dev
```

## 🔧 Si vous êtes déjà dans "backend"

Exécutez ces commandes (sans le "cd backend") :
```powershell
$env:PATH += ";C:\Program Files\nodejs"
npm run prisma:generate
npm run setup:admin
cd ..
npm run dev
```

## ✅ Commandes universelles (peu importe où vous êtes)

Ces commandes fonctionnent depuis n'importe où :

```powershell
# Ajouter Node.js au PATH
$env:PATH += ";C:\Program Files\nodejs"

# Aller dans le dossier backend (depuis la racine)
cd "C:\Users\pxksa\Documents\Compta LMB\backend"

# Régénérer Prisma
npm run prisma:generate

# Créer le compte admin
npm run setup:admin

# Retourner à la racine
cd "C:\Users\pxksa\Documents\Compta LMB"

# Démarrer les serveurs
npm run dev
```

## 🎯 Solution la plus simple

Utilisez toujours le chemin complet pour être sûr :

```powershell
$env:PATH += ";C:\Program Files\nodejs"
cd "C:\Users\pxksa\Documents\Compta LMB\backend"
npm run prisma:generate
npm run setup:admin
cd "C:\Users\pxksa\Documents\Compta LMB"
npm run dev
```

