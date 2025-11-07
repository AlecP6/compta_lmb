# 🚀 Créer un projet Neon et obtenir l'URL

## Étape 1 : Créer le projet

Dans votre terminal, vous devriez voir :
```
? What organization would you like to use? » 
>   Alec (org-divine-salad-82853291)
```

**Appuyez sur Entrée** pour sélectionner "Alec".

Ensuite, Neon va créer le projet.

## Étape 2 : Obtenir l'URL de connexion

Une fois le projet créé, exécutez :

```powershell
npx neonctl@latest connection-string
```

Cette commande vous donnera l'URL complète de connexion PostgreSQL.

## Alternative : Via l'interface web

Si vous préférez utiliser l'interface web :

1. **Allez sur** : https://console.neon.tech
2. **Cliquez sur "Create a project"**
3. **Remplissez** :
   - Name : `compta-lmb`
   - Region : Choisissez
4. **Cliquez sur "Create project"**
5. **Une fois créé**, l'URL de connexion sera affichée directement dans le dashboard

## Étape 3 : Utiliser l'URL avec Vercel

Une fois que vous avez l'URL :

1. **Allez sur Vercel** : https://vercel.com
2. **Créez un projet** pour votre backend
3. **Dans les variables d'environnement**, ajoutez :
   ```
   DATABASE_URL = (collez l'URL Neon)
   JWT_SECRET = (générez avec PowerShell)
   NODE_ENV = production
   PORT = 3000
   ```

## 🔑 Générer JWT_SECRET

```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

