import { Request, Response, NextFunction } from 'express';

/**
 * Middleware pour sécuriser les webhooks avec une clé API
 * Supporte GTARP_WEBHOOK_KEY et DISCORD_WEBHOOK_KEY
 * Si aucune clé n'est définie, le webhook reste accessible (mode développement)
 */
export const authenticateWebhook = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Essayer d'abord la clé Discord, puis la clé GTA RP, ou utiliser la clé GTA RP par défaut
  const apiKey = process.env.DISCORD_WEBHOOK_KEY || process.env.GTARP_WEBHOOK_KEY;

  // Si aucune clé n'est configurée, on autorise l'accès (mode développement)
  if (!apiKey) {
    console.warn('⚠️  Aucune clé API configurée - webhook accessible sans authentification');
    return next();
  }

  // Récupérer la clé depuis le header
  const providedKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');

  if (!providedKey) {
    return res.status(401).json({ 
      error: 'Clé API manquante',
      message: 'Veuillez fournir la clé API dans le header X-API-Key ou Authorization'
    });
  }

  if (providedKey !== apiKey) {
    return res.status(403).json({ 
      error: 'Clé API invalide',
      message: 'La clé API fournie est incorrecte'
    });
  }

  next();
};

