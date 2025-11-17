# Notifications Discord - Guide

## Configuration

Pour activer les notifications Discord, ajoutez l'URL de votre webhook Discord dans le fichier `backend/.env` :

```env
DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/1436373516789354657/oTv2E-ttMxprklSb4nNl0_VmNaLvBVXp7_4V4OeswYn-aaZjwdFttOXW1-BaWofB8b_g"
```

## Comment obtenir un webhook Discord

1. Ouvrez Discord et allez dans les **Paramètres du serveur**
2. Allez dans **Intégrations** > **Webhooks**
3. Cliquez sur **Nouveau webhook**
4. Configurez le webhook :
   - **Nom** : "Comptabilité LMB" (ou autre)
   - **Canal** : Choisissez le canal où recevoir les notifications
5. Cliquez sur **Copier l'URL du webhook**
6. Collez l'URL dans votre fichier `.env`

## Format des notifications

### Dépôt (INCOME)
```
💰 Transaction GTA RP - Dépôt
Nouvelle transaction automatique depuis le jeu

👤 Joueur: John Doe (ID: steam:11000010abc1234)
💵 Montant: $1,000.00
📝 Description: Dépôt depuis coffre principal

Catégorie: GTA RP
```

### Retrait (EXPENSE)
```
💸 Transaction GTA RP - Retrait
Nouvelle transaction automatique depuis le jeu

👤 Joueur: John Doe (ID: steam:11000010abc1234)
💵 Montant: $500.00
📝 Description: Retrait depuis coffre principal

Catégorie: GTA RP
```

## Caractéristiques

- ✅ **Notifications en temps réel** : Envoyées immédiatement après la création de la transaction
- ✅ **Embeds Discord** : Format riche avec couleurs et champs structurés
- ✅ **Non-bloquant** : Les erreurs Discord n'empêchent pas la création de la transaction
- ✅ **Couleurs dynamiques** : Vert pour les dépôts, rouge pour les retraits
- ✅ **Informations complètes** : Joueur, montant, description, catégorie

## Dépannage

### Les notifications ne s'affichent pas

1. **Vérifiez l'URL du webhook** :
   - L'URL doit commencer par `https://discord.com/api/webhooks/`
   - Assurez-vous qu'elle est complète et correcte

2. **Vérifiez les permissions** :
   - Le webhook doit avoir la permission d'envoyer des messages dans le canal
   - Vérifiez que le bot n'a pas été supprimé

3. **Vérifiez les logs** :
   - Les erreurs Discord sont loggées dans la console du serveur
   - Cherchez les messages commençant par "Erreur lors de l'envoi de la notification Discord"

4. **Testez le webhook** :
   ```bash
   curl -X POST "https://discord.com/api/webhooks/VOTRE_WEBHOOK_URL" \
     -H "Content-Type: application/json" \
     -d '{"content": "Test de notification"}'
   ```

### Le webhook a été révoqué

Si vous avez révoqué ou supprimé le webhook par accident :
1. Créez un nouveau webhook dans Discord
2. Mettez à jour `DISCORD_WEBHOOK_URL` dans `.env`
3. Redémarrez le serveur backend

## Sécurité

⚠️ **Important** : L'URL du webhook Discord est sensible. Ne la partagez pas publiquement.

- Ne commitez **jamais** le fichier `.env` dans Git
- Ajoutez `.env` à votre `.gitignore`
- Si le webhook est compromis, révoquez-le immédiatement et créez-en un nouveau

## Personnalisation

Vous pouvez modifier le format des notifications en éditant le fichier `backend/src/utils/discordWebhook.ts`.

Options disponibles :
- Modifier les couleurs des embeds
- Ajouter des champs supplémentaires
- Changer le nom d'utilisateur du webhook
- Ajouter une image/avatar

