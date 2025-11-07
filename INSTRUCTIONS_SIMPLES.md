# Instructions simples - Créer le compte admin

## 🎯 Méthode la plus simple (recommandée)

### Option 1 : Utiliser le script automatique

1. **Double-cliquez** sur le fichier `setup-admin.ps1` dans le dossier du projet
2. Attendez que le script se termine
3. C'est tout ! Le compte admin est créé

### Option 2 : Commandes manuelles

Ouvrez PowerShell dans le dossier du projet et exécutez ces commandes **une par une** :

```powershell
# 1. Ajouter Node.js au PATH
$env:PATH += ";C:\Program Files\nodejs"

# 2. Aller dans le dossier backend
cd backend

# 3. Régénérer Prisma
npm run prisma:generate

# 4. Créer le compte admin
npm run setup:admin

# 5. Retourner à la racine
cd ..

# 6. Démarrer les serveurs
npm run dev
```

## 📝 Comment exécuter une commande dans PowerShell

1. **Ouvrir PowerShell** :
   - Appuyez sur `Windows + X`
   - Choisissez "Windows PowerShell" ou "Terminal"
   - OU faites un clic droit sur le dossier du projet → "Ouvrir dans PowerShell"

2. **Taper la commande** :
   - Copiez-collez la commande dans PowerShell
   - Appuyez sur **Entrée**

3. **Attendre** :
   - La commande s'exécute
   - Vous verrez le résultat à l'écran
   - Quand c'est terminé, vous pouvez taper la commande suivante

## 🔑 Identifiants de connexion

Une fois tout configuré, connectez-vous avec :

- **Identifiant** : `Switch`
- **Mot de passe** : `Switch57220`

## ⚠️ Si vous avez des erreurs

### "npm n'est pas reconnu"
Ajoutez Node.js au PATH en tapant d'abord :
```powershell
$env:PATH += ";C:\Program Files\nodejs"
```

### "Le serveur est déjà en cours d'exécution"
Arrêtez-le avec **Ctrl + C** dans le terminal où il tourne.

### "Erreur de base de données"
Exécutez d'abord :
```powershell
cd backend
npm run prisma:migrate
```

## ✅ Vérification

Après avoir exécuté les commandes, vous devriez voir :
- `✅ Compte admin créé avec succès !`
- `🚀 Serveur démarré sur le port 3001`
- `Local: http://localhost:3000`

Ensuite, ouvrez http://localhost:3000 et connectez-vous !

