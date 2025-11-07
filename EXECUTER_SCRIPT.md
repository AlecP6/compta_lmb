# Comment exécuter le script PowerShell

## ⚠️ Important
Les fichiers `.ps1` ne peuvent pas être exécutés en double-cliquant dessus. Il faut les exécuter depuis PowerShell.

## 🚀 Méthode 1 : Depuis PowerShell (Recommandé)

### Étape 1 : Ouvrir PowerShell
1. Appuyez sur `Windows + X`
2. Choisissez "Windows PowerShell" ou "Terminal"
3. OU faites un clic droit sur le dossier `Compta LMB` → "Ouvrir dans PowerShell"

### Étape 2 : Exécuter le script
Dans PowerShell, tapez cette commande :

```powershell
.\fix-admin-complete.ps1
```

Appuyez sur **Entrée**.

### Si vous avez une erreur de sécurité
Si vous voyez une erreur comme "l'exécution de scripts est désactivée", tapez d'abord :

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Puis réessayez :
```powershell
.\fix-admin-complete.ps1
```

## 🚀 Méthode 2 : Commandes directes (Plus simple)

Au lieu d'utiliser le script, exécutez directement ces commandes dans PowerShell :

```powershell
# 1. Ajouter Node.js au PATH
$env:PATH += ";C:\Program Files\nodejs"

# 2. Aller dans le dossier backend
cd "C:\Users\pxksa\Documents\Compta LMB\backend"

# 3. Régénérer Prisma
npm run prisma:generate

# 4. Créer le compte admin
npm run setup:admin

# 5. Retourner à la racine
cd ..

# 6. Démarrer les serveurs
npm run dev
```

## 📝 Instructions détaillées

1. **Ouvrez PowerShell** dans le dossier du projet
2. **Copiez-collez** chaque commande une par une
3. **Appuyez sur Entrée** après chaque commande
4. **Attendez** que chaque commande se termine avant de passer à la suivante

## ✅ Résultat attendu

Après avoir exécuté les commandes, vous devriez voir :
- `✔ Generated Prisma Client`
- `✅ Compte admin créé avec succès !`
- `🚀 Serveur démarré sur le port 3001`

Ensuite, connectez-vous avec :
- **Identifiant** : `Switch`
- **Mot de passe** : `Switch57220`

