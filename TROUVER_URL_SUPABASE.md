# 🔍 Comment trouver l'URL de la base de données sur Supabase

## 📍 Méthode 1 : Via Settings > Database (La plus simple)

1. **Allez sur** : https://supabase.com/dashboard
2. **Cliquez sur votre projet** (celui que vous avez créé, ex: `compta-lmb`)
3. **Dans le menu de gauche**, cliquez sur **"Settings"** (l'icône d'engrenage ⚙️)
4. **Dans le sous-menu**, cliquez sur **"Database"**
5. **Faites défiler** jusqu'à la section **"Connection string"**
6. **Vous verrez plusieurs onglets** :
   - URI
   - JDBC
   - etc.
7. **Cliquez sur l'onglet "URI"**
8. **Vous verrez quelque chose comme** :
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
9. **Remplacez `[YOUR-PASSWORD]`** par le mot de passe que vous avez choisi lors de la création du projet
10. **COPIEZ cette URL complète** (avec le mot de passe remplacé)

## 📍 Méthode 2 : Via Project Settings > Database

1. **Allez sur** : https://supabase.com/dashboard
2. **Cliquez sur votre projet**
3. **En haut à droite**, cliquez sur **"Project Settings"** (ou l'icône ⚙️)
4. **Dans le menu de gauche**, cliquez sur **"Database"**
5. **Faites défiler** jusqu'à **"Connection string"**
6. **Cliquez sur l'onglet "URI"**
7. **Remplacez `[YOUR-PASSWORD]`** par votre mot de passe
8. **COPIEZ l'URL**

## 📍 Méthode 3 : Via l'onglet SQL Editor

1. **Allez sur** : https://supabase.com/dashboard
2. **Cliquez sur votre projet**
3. **Dans le menu de gauche**, cliquez sur **"SQL Editor"**
4. **En haut**, vous verrez parfois l'URL de connexion affichée
5. **Sinon**, utilisez les méthodes 1 ou 2

## 🔑 Si vous avez oublié votre mot de passe

1. **Allez dans** : Settings > Database
2. **Faites défiler** jusqu'à **"Database password"**
3. **Cliquez sur "Reset database password"**
4. **Choisissez un nouveau mot de passe** (notez-le bien !)
5. **Utilisez ce nouveau mot de passe** dans l'URL

## 📝 Format de l'URL complète

L'URL devrait ressembler à ceci :

```
postgresql://postgres:VOTRE_MOT_DE_PASSE_ICI@db.abcdefghijklmnop.supabase.co:5432/postgres
```

**Important** :
- Remplacez `VOTRE_MOT_DE_PASSE_ICI` par votre vrai mot de passe
- Ne mettez PAS d'espaces
- L'URL doit être sur une seule ligne

## ✅ Exemple concret

Si votre mot de passe est `MonMotDePasse123!` et que Supabase vous donne :

```
postgresql://postgres:[YOUR-PASSWORD]@db.abc123.supabase.co:5432/postgres
```

Alors votre URL finale sera :

```
postgresql://postgres:MonMotDePasse123!@db.abc123.supabase.co:5432/postgres
```

## 🎯 Chemin complet dans l'interface

```
Dashboard Supabase
  → Votre projet (cliquez dessus)
    → Settings (menu de gauche, icône ⚙️)
      → Database (sous-menu)
        → Connection string (section)
          → Onglet "URI"
            → Remplacez [YOUR-PASSWORD]
            → COPIEZ l'URL complète
```

## ⚠️ Important

- **Ne partagez JAMAIS** cette URL publiquement (elle contient votre mot de passe)
- **Utilisez cette URL** uniquement dans les variables d'environnement (Vercel, etc.)
- **L'URL est sensible à la casse** (majuscules/minuscules)

## 🐛 Si vous ne trouvez toujours pas

1. **Vérifiez** que vous êtes bien connecté à Supabase
2. **Vérifiez** que vous avez bien créé un projet
3. **Essayez** de rafraîchir la page (F5)
4. **Vérifiez** que vous êtes dans le bon projet

Si ça ne marche toujours pas, dites-moi exactement ce que vous voyez dans l'interface Supabase et je vous guiderai plus précisément !

