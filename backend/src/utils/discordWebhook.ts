/**
 * Utilitaire pour envoyer des notifications Discord via webhook
 */

interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  footer?: {
    text: string;
  };
  timestamp?: string;
}

interface DiscordWebhookPayload {
  username?: string;
  avatar_url?: string;
  embeds?: DiscordEmbed[];
  content?: string;
}

/**
 * Envoie une notification Discord via webhook
 */
export async function sendDiscordNotification(
  webhookUrl: string,
  payload: DiscordWebhookPayload
): Promise<boolean> {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Erreur Discord webhook: ${response.status} ${response.statusText}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification Discord:', error);
    return false;
  }
}

/**
 * Crée une notification Discord pour une transaction GTA RP
 */
export function createTransactionDiscordEmbed(
  transactionType: 'INCOME' | 'EXPENSE',
  amount: number,
  userName: string,
  gameId: string,
  description: string,
  category?: string
): DiscordEmbed {
  const isIncome = transactionType === 'INCOME';
  const color = isIncome ? 0x00ff00 : 0xff0000; // Vert pour revenus, rouge pour dépenses
  const emoji = isIncome ? '💰' : '💸';
  const typeLabel = isIncome ? 'Dépôt' : 'Retrait';

  return {
    title: `${emoji} Transaction GTA RP - ${typeLabel}`,
    description: `Nouvelle transaction automatique depuis le jeu`,
    color: color,
    fields: [
      {
        name: '👤 Joueur',
        value: `${userName} (ID: ${gameId})`,
        inline: true,
      },
      {
        name: '💵 Montant',
        value: `$${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        inline: true,
      },
      {
        name: '📝 Description',
        value: description || 'Aucune description',
        inline: false,
      },
    ],
    footer: {
      text: 'Comptabilité BlackDawg MC',
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Envoie une notification Discord pour une transaction GTA RP
 */
export async function notifyDiscordTransaction(
  webhookUrl: string | undefined,
  transactionType: 'INCOME' | 'EXPENSE',
  amount: number,
  userName: string,
  gameId: string,
  description: string,
  category?: string
): Promise<void> {
  if (!webhookUrl) {
    return; // Pas de webhook configuré, on ignore silencieusement
  }

  const embed = createTransactionDiscordEmbed(
    transactionType,
    amount,
    userName,
    gameId,
    description,
    category
  );

  const payload: DiscordWebhookPayload = {
    username: 'Comptabilité BlackDawg MC',
    embeds: [embed],
  };

  await sendDiscordNotification(webhookUrl, payload);
}

