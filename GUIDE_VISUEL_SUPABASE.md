# 🖼️ Guide Visuel : Trouver l'URL Supabase

## Étape par étape avec descriptions visuelles

### ÉTAPE 1 : Accéder à votre projet

```
┌─────────────────────────────────────────┐
│  Supabase Dashboard                     │
│                                         │
│  📁 Mes Projets                        │
│  ┌─────────────────────────────────┐  │
│  │  compta-lmb                     │  │ ← Cliquez ici
│  │  Créé il y a 2 jours            │  │
│  └─────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### ÉTAPE 2 : Aller dans Settings

Une fois dans votre projet, vous verrez un menu de gauche :

```
┌─────────────────────────────────────────┐
│  [Logo] compta-lmb                     │
│                                         │
│  📊 Table Editor                        │
│  🔍 SQL Editor                          │
│  🔐 Authentication                      │
│  📡 API                                  │
│  ⚙️  Settings              ← CLIQUEZ ICI │
│  📚 Documentation                        │
└─────────────────────────────────────────┘
```

### ÉTAPE 3 : Cliquer sur Database

Dans Settings, vous verrez un sous-menu :

```
┌─────────────────────────────────────────┐
│  Settings                               │
│                                         │
│  General                                │
│  API                                    │
│  Database              ← CLIQUEZ ICI    │
│  Auth                                   │
│  Storage                                │
└─────────────────────────────────────────┘
```

### ÉTAPE 4 : Trouver Connection string

Dans Database, faites défiler jusqu'à voir :

```
┌─────────────────────────────────────────┐
│  Database Settings                      │
│                                         │
│  Database password                      │
│  [Reset database password]              │
│                                         │
│  Connection string                      │ ← VOUS ÊTES ICI
│  ┌─────────────────────────────────┐  │
│  │  [URI] [JDBC] [Golang] [Python] │  │
│  │                                  │  │
│  │  postgresql://postgres:          │  │
│  │  [YOUR-PASSWORD]@db.xxx.        │  │
│  │  supabase.co:5432/postgres       │  │
│  └─────────────────────────────────┘  │
│                                         │
│  ⚠️ Remplacez [YOUR-PASSWORD]          │
│     par votre mot de passe              │
└─────────────────────────────────────────┘
```

### ÉTAPE 5 : Remplacer le mot de passe

1. **Cliquez dans le champ** de l'URL
2. **Trouvez** `[YOUR-PASSWORD]`
3. **Remplacez-le** par votre vrai mot de passe
4. **COPIEZ** toute l'URL

### Exemple avant/après

**AVANT** (ce que vous voyez) :
```
postgresql://postgres:[YOUR-PASSWORD]@db.abc123.supabase.co:5432/postgres
```

**APRÈS** (ce que vous devez copier, si votre mot de passe est `MonPass123!`) :
```
postgresql://postgres:MonPass123!@db.abc123.supabase.co:5432/postgres
```

## 🎯 Résumé en 3 clics

1. **Projet** → Cliquez sur votre projet
2. **Settings** → Menu de gauche, icône ⚙️
3. **Database** → Sous-menu Settings
4. **Connection string** → Section Database
5. **URI** → Onglet dans Connection string
6. **Remplacez** `[YOUR-PASSWORD]` par votre mot de passe
7. **COPIEZ** l'URL complète

## ✅ Vérification

Votre URL doit :
- ✅ Commencer par `postgresql://`
- ✅ Contenir `postgres:` (deux points)
- ✅ Contenir votre mot de passe (pas `[YOUR-PASSWORD]`)
- ✅ Contenir `@db.`
- ✅ Contenir `.supabase.co`
- ✅ Se terminer par `:5432/postgres`

Si votre URL correspond à ces critères, c'est la bonne ! 🎉

