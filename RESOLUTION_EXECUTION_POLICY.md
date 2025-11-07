# Résolution de l'erreur d'exécution PowerShell

## 🔧 Solution rapide

Vous devez d'abord autoriser l'exécution de scripts dans PowerShell.

### Étape 1 : Activer l'exécution de scripts

Dans PowerShell, tapez cette commande et appuyez sur **Entrée** :

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Quand on vous demande de confirmer, tapez **Y** et appuyez sur **Entrée**.

### Étape 2 : Vérifier que ça fonctionne

Tapez :
```powershell
npm --version
```

Vous devriez voir une version (ex: 11.6.1). Si c'est le cas, c'est bon !

### Étape 3 : Exécuter les commandes

Maintenant vous pouvez exécuter les commandes normalement :

```powershell
$env:PATH += ";C:\Program Files\nodejs"
cd backend
npm run prisma:generate
npm run setup:admin
cd ..
npm run dev
```

## 📝 Explication

Cette erreur se produit parce que Windows bloque l'exécution de scripts PowerShell par défaut pour des raisons de sécurité. La commande `Set-ExecutionPolicy` autorise l'exécution de scripts signés ou créés localement.

## ✅ Alternative : Utiliser cmd.exe

Si vous préférez ne pas modifier la politique PowerShell, vous pouvez utiliser l'invite de commandes (cmd.exe) :

1. Appuyez sur `Windows + R`
2. Tapez `cmd` et appuyez sur Entrée
3. Exécutez les commandes (sans le `$env:PATH`, car cmd utilise le PATH système) :

```cmd
cd "C:\Users\pxksa\Documents\Compta LMB\backend"
npm run prisma:generate
npm run setup:admin
cd ..
npm run dev
```

