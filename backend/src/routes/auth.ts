import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

// Inscription
router.post(
  '/register',
  [
    body('username')
      .trim()
      .isLength({ min: 3 })
      .withMessage('L\'identifiant doit contenir au moins 3 caractères')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('L\'identifiant ne peut contenir que des lettres, chiffres et underscores'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    body('name').trim().notEmpty().withMessage('Le nom est requis'),
    body('gameId').optional().trim(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password, name, gameId } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Cet identifiant est déjà utilisé' });
      }

      // Vérifier si le gameId est déjà utilisé (si fourni)
      if (gameId) {
        const existingGameId = await prisma.user.findUnique({
          where: { gameId },
        });

        if (existingGameId) {
          return res.status(400).json({ error: 'Cet ID de jeu est déjà associé à un compte' });
        }
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer l'utilisateur
      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          name,
          gameId: gameId || null,
        },
      });

      // Générer un token JWT
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return res.status(500).json({ error: 'Configuration serveur invalide' });
      }

      const token = jwt.sign({ userId: user.id }, jwtSecret, {
        expiresIn: '7d',
      });

      res.status(201).json({
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          gameId: user.gameId,
        },
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
    }
  }
);

// Connexion
router.post(
  '/login',
  [
    body('username').trim().notEmpty().withMessage('L\'identifiant est requis'),
    body('password').notEmpty().withMessage('Le mot de passe est requis'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password } = req.body;

      // Trouver l'utilisateur
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' });
      }

      // Vérifier le mot de passe
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' });
      }

      // Générer un token JWT
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return res.status(500).json({ error: 'Configuration serveur invalide' });
      }

      const token = jwt.sign({ userId: user.id }, jwtSecret, {
        expiresIn: '7d',
      });

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          gameId: user.gameId,
        },
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
    }
  }
);

// Obtenir les informations de l'utilisateur connecté
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token d\'accès manquant' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: 'Configuration serveur invalide' });
    }

    const decoded: any = jwt.verify(token, jwtSecret);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        name: true,
        gameId: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(401).json({ error: 'Token invalide' });
  }
});

export default router;

