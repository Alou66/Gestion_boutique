/**
 * Routes Approvisionnement - API REST
 * Définit toutes les routes pour les opérations Approvisionnement
 */

import { Router } from 'express';
import { z } from 'zod';
import {
  createApprovisionnementSchema,
} from '../validations/approvisionnement.validation.js';
import {
  validate,
} from '../middlewares/validate.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import ApprovisionnementController from '../controllers/approvisionnement.controller.js';

/**
 * Crée les routes pour les opérations Approvisionnement
 * @param {ApprovisionnementController} controller - Instance du controller Approvisionnement
 * @returns {Router} Router Express configuré
 */
const createApprovisionnementRoutes = (controller) => {
  const router = Router();

  // Applique l'authentification à toutes les routes approvisionnements
  router.use(authenticate);

  /**
   * @swagger
   * tags:
   *   name: Approvisionnements
   *   description: Opérations CRUD pour la gestion des approvisionnements
   */

  /**
   * @swagger
   * /api/approvisionnements:
   *   post:
   *     summary: Créer un nouvel approvisionnement
   *     tags: [Approvisionnements]
   *     description: Crée un nouvel approvisionnement et met a jour le stock du produit
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - fournisseurId
   *               - produitId
   *               - quantite
   *             properties:
   *               fournisseurId:
   *                 type: string
   *                 format: uuid
   *                 description: ID du fournisseur
   *                 example: "123e4567-e89b-12d3-a456-426614174000"
   *               produitId:
   *                 type: string
   *                 format: uuid
   *                 description: ID du produit
   *                 example: "123e4567-e89b-12d3-a456-426614174000"
   *               quantite:
   *                 type: integer
   *                 minimum: 1
   *                 description: Quantité approvisionnée
   *                 example: 50
   *               date:
   *                 type: string
   *                 format: date-time
   *                 description: Date de l'approvisionnement
   *                 example: "2026-01-01T12:00:00.000Z"
   *     responses:
   *       201:
   *         description: Approvisionnement cree et stock mis a jour avec succes
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Approvisionnement cree et stock mis a jour avec succes"
   *                 data:
   *                   $ref: '#/components/schemas/Approvisionnement'
   *       400:
   *         description: Erreur de validation
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Accès refusé - Token manquant ou invalide
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Accès refusé. Token manquant."
   *       404:
   *         description: Fournisseur ou produit non trouve
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Erreur serveur
   */
  router.post(
    '/',
    validate(createApprovisionnementSchema),
    controller.create.bind(controller)
  );

  /**
   * @swagger
   * /api/approvisionnements:
   *   get:
   *     summary: Récupérer tous les approvisionnements
   *     tags: [Approvisionnements]
   *     description: Récupère la liste de tous les approvisionnements avec leurs relations
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Approvisionnements recuperes avec succes
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Approvisionnements recuperes avec succes"
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Approvisionnement'
   *       401:
   *         description: Accès refusé - Token manquant ou invalide
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Accès refusé. Token manquant."
   *       500:
   *         description: Erreur serveur
   */
  router.get('/', controller.findAll.bind(controller));

  /**
   * @swagger
   * /api/approvisionnements/{id}:
   *   get:
   *     summary: Récupérer un approvisionnement par ID
   *     tags: [Approvisionnements]
   *     description: Récupère un approvisionnement spécifique avec ses relations
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID de l'approvisionnement
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     responses:
   *       200:
   *         description: Approvisionnement recupere avec succes
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Approvisionnement recupere avec succes"
   *                 data:
   *                   $ref: '#/components/schemas/Approvisionnement'
   *       400:
   *         description: ID invalide
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Accès refusé - Token manquant ou invalide
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Accès refusé. Token manquant."
   *       404:
   *         description: Approvisionnement non trouvé
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Erreur serveur
   */
  router.get(
    '/:id',
    validate(
      z.object({
        id: z.string().uuid('ID invalide - doit être un UUID valide'),
      }),
      'params'
    ),
    controller.findById.bind(controller)
  );

  /**
   * @swagger
   * /api/approvisionnements/{id}:
   *   delete:
   *     summary: Supprimer un approvisionnement
   *     tags: [Approvisionnements]
   *     description: Supprime un approvisionnement (le stock n'est pas réduit)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID de l'approvisionnement
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     responses:
   *       200:
   *         description: Approvisionnement supprime avec succes
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Approvisionnement supprime avec succes"
   *                 data:
   *                   $ref: '#/components/schemas/Approvisionnement'
   *       400:
   *         description: ID invalide
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Accès refusé - Token manquant ou invalide
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Accès refusé. Token manquant."
   *       404:
   *         description: Approvisionnement non trouvé
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Erreur serveur
   */
  router.delete(
    '/:id',
    validate(
      z.object({
        id: z.string().uuid('ID invalide - doit être un UUID valide'),
      }),
      'params'
    ),
    controller.delete.bind(controller)
  );

  return router;
};

export default createApprovisionnementRoutes;
