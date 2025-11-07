# 🔧 Résolution du problème - Compte admin

## Problème détecté

Le serveur backend est probablement en cours d'exécution, ce qui empêche Prisma de se régénérer.

## Solution étape par étape

### Étape 1 : Arrêter le serveur backend

**Méthode 1 - Via le terminal :**
1. Trouvez le terminal où le serveur backend tourne
2. Appuyez sur **Ctrl + C**
3. Attendez que le serveur s'arrête complètement

**Méthode 2 - Via le gestionnaire de tâches :**
1. Appuyez sur `Ctrl + Shift + Esc` pour ouvrir le Gestionnaire des tâches
2. Cherchez les processus "node.exe"
3. Cliquez droit → "Arrêter la tâche"

### Étape 2 : Exécuter les commandes

Ouvrez un **nouveau** PowerShell dans le dossier du projet et exécutez :

```powershell
# Ajouter Node.js au PATH
$env:PATH += ";C:\Program Files\nodejs"

# Aller dans backend
cd "C:\Users\pxksa\Documents\Compta LMB\backend"

# Régénérer Prisma (maintenant que le serveur est arrêté)
npm run prisma:generate

# Créer le compte admin
npm run setup:admin
```

### Étape 3 : Redémarrer les serveurs

```powershell
# Retourner à la racine
cd ..

# Démarrer les serveurs
npm run dev
```

## ✅ Vérification

Après avoir exécuté ces commandes, vous devriez voir :
- `✔ Generated Prisma Client`
- `✅ Compte admin créé avec succès !`
- `🚀 Serveur démarré sur le port 3001`

## 🔑 Connexion

Allez sur **http://localhost:3000** et connectez-vous avec :
- **Identifiant** : `Switch`
- **Mot de passe** : `Switch57220`

## 🆘 Si ça ne fonctionne toujours pas

1. Fermez **tous** les terminaux PowerShell
2. Fermez **tous** les processus Node.js dans le Gestionnaire des tâches
3. Attendez 5 secondes
4. Rouvrez un nouveau PowerShell
5. Réessayez les commandes

