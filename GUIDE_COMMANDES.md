# Guide d'exécution des commandes - Compta LMB

## 📋 Prérequis

Assurez-vous que Node.js est installé et accessible. Si ce n'est pas le cas, ajoutez Node.js au PATH ou utilisez le chemin complet.

## 🚀 Étapes pour créer le compte admin

### Étape 1 : Ouvrir un terminal PowerShell

1. Appuyez sur `Windows + R`
2. Tapez `powershell` et appuyez sur Entrée
3. OU cliquez droit sur le dossier du projet et choisissez "Ouvrir dans PowerShell"

### Étape 2 : Aller dans le dossier du projet

Dans le terminal PowerShell, tapez :

```powershell
cd "C:\Users\pxksa\Documents\Compta LMB"
```

Appuyez sur **Entrée**.

### Étape 3 : Arrêter le serveur (si il tourne)

Si vous avez un serveur qui tourne dans un autre terminal :
- Allez dans ce terminal
- Appuyez sur **Ctrl + C** pour l'arrêter
- Attendez qu'il s'arrête complètement

### Étape 4 : Aller dans le dossier backend

```powershell
cd backend
```

Appuyez sur **Entrée**.

### Étape 5 : Régénérer Prisma

```powershell
$env:PATH += ";C:\Program Files\nodejs"
npm run prisma:generate
```

Appuyez sur **Entrée** et attendez que ça se termine (vous verrez "✔ Generated Prisma Client").

### Étape 6 : Créer le compte admin

```powershell
npm run setup:admin
```

Appuyez sur **Entrée**. Vous devriez voir :
```
✅ Compte admin créé avec succès !
   Identifiant: Switch
   Nom: Switch
   Mot de passe: Switch57220
```

### Étape 7 : Retourner à la racine et démarrer les serveurs

```powershell
cd ..
npm run dev
```

Appuyez sur **Entrée**. Les deux serveurs (backend et frontend) vont démarrer.

## 🔑 Identifiants de connexion

Une fois les serveurs démarrés, allez sur **http://localhost:3000** et connectez-vous avec :

- **Identifiant** : `Switch`
- **Mot de passe** : `Switch57220`

## 📝 Commandes complètes (copier-coller)

Si vous préférez tout faire d'un coup, voici toutes les commandes à la suite :

```powershell
# 1. Aller dans le projet
cd "C:\Users\pxksa\Documents\Compta LMB"

# 2. Ajouter Node.js au PATH (si nécessaire)
$env:PATH += ";C:\Program Files\nodejs"

# 3. Aller dans backend
cd backend

# 4. Régénérer Prisma
npm run prisma:generate

# 5. Créer le compte admin
npm run setup:admin

# 6. Retourner à la racine
cd ..

# 7. Démarrer les serveurs
npm run dev
```

## ⚠️ Problèmes courants

### "npm n'est pas reconnu"
Ajoutez Node.js au PATH :
```powershell
$env:PATH += ";C:\Program Files\nodejs"
```

### "Le serveur ne démarre pas"
Vérifiez que les ports 3000 et 3001 ne sont pas utilisés par d'autres applications.

### "Erreur de base de données"
Assurez-vous que le fichier `backend/prisma/dev.db` existe. Sinon, exécutez :
```powershell
cd backend
npm run prisma:migrate
```

## ✅ Vérification

Pour vérifier que tout fonctionne :

1. Le backend doit afficher : `🚀 Serveur démarré sur le port 3001`
2. Le frontend doit afficher : `Local: http://localhost:3000`
3. Ouvrez http://localhost:3000 dans votre navigateur
4. Connectez-vous avec `Switch` / `Switch57220`

