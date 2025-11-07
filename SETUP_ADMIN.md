# Configuration automatique du compte admin

Le compte admin est maintenant créé **automatiquement** au démarrage du serveur backend.

## Identifiants du compte admin

- **Identifiant** : `Switch`
- **Mot de passe** : `Switch57220`

## Si vous ne pouvez pas vous connecter

1. **Arrêtez le serveur backend** (Ctrl+C dans le terminal)

2. **Régénérez Prisma** :
   ```bash
   cd backend
   npm run prisma:generate
   ```

3. **Créez manuellement le compte admin** :
   ```bash
   npm run setup:admin
   ```

4. **Redémarrez le serveur** :
   ```bash
   npm run dev
   ```

Le compte admin sera automatiquement vérifié et créé/mis à jour à chaque démarrage du serveur.

