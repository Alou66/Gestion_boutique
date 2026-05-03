/**
 * @swagger
 * tags:
 *   name: Authentification
 *   description: Opérations d'authentification et gestion des sessions
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Identifiant unique de l'utilisateur
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         email:
 *           type: string
 *           format: email
 *           description: Email de l'utilisateur
 *           example: admin@example.com
 *         role:
 *           type: string
 *           description: Rôle de l'utilisateur
 *           example: ADMIN
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *           example: 2026-01-01T12:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de dernière mise à jour
 *           example: 2026-01-01T12:00:00.000Z
 *     UserResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Opération réussie
 *         data:
 *           $ref: '#/components/schemas/User'
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Connexion réussie
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: Token JWT
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *             user:
 *               $ref: '#/components/schemas/User'
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - confirmPassword
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email de l'administrateur
 *           example: admin@example.com
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           description: Mot de passe (minimum 6 caractères)
 *           example: secret123456
 *         confirmPassword:
 *           type: string
 *           format: password
 *           description: Confirmation du mot de passe
 *           example: secret123456
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email de l'administrateur
 *           example: admin@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: Mot de passe
 *           example: secret123456
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * Routes pour l'authentification
 * Définition des endpoints d'authentification
 */

import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { registerAdminSchema, loginSchema } from '../validations/auth.validation.js';

/**
 * Crée les routes d'authentification
 * @param {AuthController} authController - Controller d'authentification
 * @returns {Router} Router Express configuré
 */
export default function createAuthRoutes(authController) {
  const router = Router();

  // Routes publiques
  
  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Inscription d'un administrateur
   *     tags: [Authentification]
   *     description: Crée un nouveau compte administrateur
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterRequest'
   *     responses:
   *       201:
   *         description: Administrateur créé avec succès
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserResponse'
   *       400:
   *         description: Erreur de validation
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       409:
   *         description: Un compte avec cet email existe déjà
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.post('/register', validate(registerAdminSchema, 'body'), (req, res, next) => authController.register(req, res, next));

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Connexion d'un administrateur
   *     tags: [Authentification]
   *     description: Authentifie un administrateur et retourne un token JWT
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     responses:
   *       200:
   *         description: Connexion réussie
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LoginResponse'
   *       400:
   *         description: Erreur de validation
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Email ou mot de passe incorrect
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.post('/login', validate(loginSchema, 'body'), (req, res, next) => authController.login(req, res, next));

  // Route protégée (nécessite une authentification)
  // On applique le middleware d'authentification uniquement sur cette route
  
  /**
   * @swagger
   * /api/auth/profile:
   *   get:
   *     summary: Récupérer le profil de l'utilisateur connecté
   *     tags: [Authentification]
   *     description: Récupère les informations du profil de l'utilisateur authentifié
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Profil utilisateur
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserResponse'
   *       401:
   *         description: Non autorisé - Token manquant ou invalide
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get('/profile', authenticate, (req, res, next) => authController.profile(req, res, next));

  return router;
}


