# Solution Alternative : Déployer sur Fly.io (Gratuit et Simple)

Fly.io est une excellente alternative gratuite à Render. Voici comment déployer votre backend.

## 🚀 Étape 1 : Installer Fly CLI

1. **Ouvrez PowerShell en tant qu'administrateur**
2. **Installez Fly CLI** :
   ```powershell
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```
3. **Redémarrez PowerShell** après l'installation

## 🚀 Étape 2 : Créer un compte Fly.io

1. **Allez sur** : https://fly.io
2. **Créez un compte gratuit** (avec GitHub ou email)
3. **Notez votre email** et votre mot de passe

## 🚀 Étape 3 : Se connecter à Fly.io

Dans PowerShell (dans le dossier de votre projet) :

```powershell
cd "C:\Users\pxksa\Documents\Compta LMB\backend"
fly auth login
```

Suivez les instructions pour vous connecter.

## 🚀 Étape 4 : Créer une base de données PostgreSQL

```powershell
fly postgres create --name compta-db --region ams
```

(Remplacez `ams` par la région la plus proche : `ams`=Amsterdam, `iad`=Washington, `lhr`=Londres)

**Notez l'URL de connexion** qui s'affiche.

## 🚀 Étape 5 : Créer l'application Fly.io

```powershell
fly launch --name compta-backend --region ams
```

Répondez aux questions :
- **App name** : `compta-backend` (ou laissez le nom suggéré)
- **Region** : Choisissez la même que la base de données
- **Postgres** : Dites "no" (on l'a déjà créé)
- **Redis** : Dites "no"

## 🚀 Étape 6 : Configurer les variables d'environnement

```powershell
fly secrets set DATABASE_URL="votre-url-postgresql-ici"
fly secrets set JWT_SECRET="votre-clé-secrète-aléatoire"
fly secrets set NODE_ENV="production"
fly secrets set PORT="3000"
```

Pour générer JWT_SECRET :
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

## 🚀 Étape 7 : Créer le fichier fly.toml

Créez un fichier `fly.toml` dans le dossier `backend` :

```toml
app = "compta-backend"
primary_region = "ams"

[build]
  builder = "paketobuildpacks/builder:base"

[env]
  PORT = "3000"
  NODE_ENV = "production"

[[services]]
  internal_port = 3000
  protocol = "tcp"

  [[services.ports]]
    port = 80
    handlers = ["http"]
    force_https = true

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]

  [services.concurrency]
    type = "connections"
    hard_limit = 25
    soft_limit = 20

  [[services.http_checks]]
    interval = "10s"
    timeout = "2s"
    grace_period = "5s"
    method = "GET"
    path = "/api/health"
```

## 🚀 Étape 8 : Déployer

```powershell
fly deploy
```

Fly.io va automatiquement :
1. Builder votre application
2. Exécuter les migrations Prisma
3. Démarrer le serveur

## 🚀 Étape 9 : Obtenir l'URL

```powershell
fly status
```

Vous verrez l'URL de votre backend (ex: `https://compta-backend.fly.dev`)

## 🚀 Étape 10 : Mettre à jour Netlify

1. **Netlify** → Votre site → **Environment variables**
2. **Modifiez** `VITE_API_URL` : `https://compta-backend.fly.dev/api`
3. **Redéployez**

## ✅ C'est tout !

Votre backend est maintenant sur Fly.io et votre frontend sur Netlify !

