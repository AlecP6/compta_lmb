# 🔍 Vérifier les Logs Vercel pour Diagnostiquer le Problème

## ❌ Problème : Erreur 401 lors de la connexion

L'erreur 401 peut signifier que :
1. Le compte admin n'a pas été créé
2. Il y a un problème avec la base de données
3. L'initialisation n'a pas fonctionné

## ✅ Solution : Vérifier les Logs Vercel

### 1. Accéder aux Logs

1. **Allez sur** : https://vercel.com
2. **Sélectionnez votre projet** : `compta-psbedbhfp-alecp6s-projects`
3. **Allez dans** : **Functions** (dans le menu de gauche)
4. **Cliquez sur** : `api/index.ts`
5. **Allez dans l'onglet** : **Logs**

### 2. Ce que vous devriez voir

**Si tout fonctionne** :
- ✅ "🔄 Synchronisation du schéma Prisma avec la base de données..."
- ✅ "✅ Schéma synchronisé"
- ✅ "✅ Compte admin créé avec succès !"
- ✅ "✅ Initialisation terminée"

**Si il y a un problème** :
- ❌ "❌ Erreur lors de l'initialisation de l'admin: ..."
- ❌ "⚠️ Erreur lors de la synchronisation: ..."
- ❌ Erreurs Prisma
- ❌ Erreurs de connexion base de données

### 3. Forcer une Nouvelle Initialisation

Si les logs montrent que l'initialisation n'a pas fonctionné :

1. **Faites une requête** à `/api/health` pour déclencher l'initialisation
2. **Regardez les logs** en temps réel
3. **Copiez les erreurs** si il y en a

### 4. Vérifier la Base de Données

Si l'initialisation échoue, vérifiez :

1. **DATABASE_URL** est correct dans Vercel
2. **La base de données Neon** est accessible
3. **Les tables** ont été créées

## 🔧 Actions Correctives

### Si le compte admin n'existe pas

Vous pouvez créer le compte admin manuellement via l'inscription :

```powershell
$body = @{
    username = "Switch"
    password = "Switch57220"
    name = "Switch"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://compta-psbedbhfp-alecp6s-projects.vercel.app/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

### Si l'initialisation échoue

1. **Vérifiez les logs** Vercel
2. **Vérifiez DATABASE_URL** dans Vercel
3. **Vérifiez** que la base de données Neon est accessible
4. **Redéployez** si nécessaire

## 📝 Informations à Me Donner

Pour que je puisse vous aider, donnez-moi :

1. **Les logs complets** de Vercel (Functions > Logs)
2. **Le résultat** du test d'inscription
3. **Les erreurs** que vous voyez

Je pourrai identifier précisément le problème !

