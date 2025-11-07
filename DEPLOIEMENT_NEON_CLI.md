# 🚀 Déploiement avec Neon CLI

Guide pour utiliser Neon via la ligne de commande.

## 📋 Prérequis

- Node.js installé (déjà fait)
- Compte Neon créé (https://neon.tech)

## 🔧 Étape 1 : Initialiser Neon

```powershell
cd "C:\Users\pxksa\Documents\Compta LMB"
npx neonctl@latest init
```

Cette commande va :
- Vous demander de vous connecter à Neon
- Créer un projet si nécessaire
- Générer un fichier de configuration

## 🔧 Étape 2 : Se connecter à Neon

Si c'est la première fois, Neon vous demandera de vous authentifier :
1. **Ouvrez votre navigateur** (Neon l'ouvrira automatiquement)
2. **Connectez-vous** à votre compte Neon
3. **Autorisez** Neon CLI

## 🔧 Étape 3 : Créer un projet (si nécessaire)

Si vous n'avez pas encore de projet :

```powershell
npx neonctl@latest projects create --name compta-lmb
```

## 🔧 Étape 4 : Créer une base de données

```powershell
npx neonctl@latest branches create --project-id VOTRE_PROJECT_ID
```

Ou plus simplement, Neon CLI peut le faire automatiquement lors de l'init.

## 🔧 Étape 5 : Obtenir l'URL de connexion

```powershell
npx neonctl@latest connection-string
```

Cette commande vous donnera l'URL complète de connexion PostgreSQL.

## 🔧 Étape 6 : Utiliser l'URL avec Vercel

1. **Copiez l'URL** obtenue à l'étape 5
2. **Allez sur Vercel** : https://vercel.com
3. **Créez un projet** pour votre backend
4. **Ajoutez la variable** :
   ```
   DATABASE_URL = (l'URL Neon que vous avez copiée)
   ```

## 📝 Fichier de configuration

Après `neonctl init`, un fichier `.neon` ou `neon.json` sera créé avec votre configuration.

## ✅ Commandes utiles Neon CLI

```powershell
# Voir tous vos projets
npx neonctl@latest projects list

# Voir les branches d'un projet
npx neonctl@latest branches list --project-id VOTRE_ID

# Obtenir l'URL de connexion
npx neonctl@latest connection-string

# Voir les informations du projet
npx neonctl@latest projects get
```

## 🎯 Alternative : Utiliser l'interface web

Si la CLI est trop complexe, vous pouvez toujours :
1. **Allez sur** : https://console.neon.tech
2. **Créez un projet** via l'interface web
3. **L'URL sera affichée** directement dans le dashboard

## 🐛 Dépannage

### Erreur d'authentification
- Vérifiez que vous êtes bien connecté : `npx neonctl@latest auth status`
- Reconnectez-vous : `npx neonctl@latest auth login`

### Erreur de projet
- Listez vos projets : `npx neonctl@latest projects list`
- Créez-en un si nécessaire : `npx neonctl@latest projects create --name compta-lmb`

