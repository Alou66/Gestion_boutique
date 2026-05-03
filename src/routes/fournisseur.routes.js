/**
 * @swagger
 * tags:
 *   name: Fournisseurs
 *   description: Opérations CRUD pour la gestion des fournisseurs
 */

import { z } from 'zod';
import { Router } from 'express';
import {
  createFournisseurSchema,
  updateFournisseurSchema,
} from '../validations/fournisseur.validation.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import FournisseurController from '../controllers/fournisseur.controller.js';

const createFournisseurRoutes = (controller) => {
  const router = Router();

  // Applique l'authentification à toutes les routes fournisseurs
  router.use(authenticate);

  /**
   * @swagger
   * /api/fournisseurs:
   *   post:
   *     summary: Créer un nouveau fournisseur
   *     tags: [Fournisseurs]
   *     description: Crée un nouveau fournisseur dans le système
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - nom
   *               - telephone
   *               - adresse
   *             properties:
   *               nom:
   *                 type: string
   *                 minLength: 2
   *                 maxLength: 100
   *                 description: Nom du fournisseur
   *                 example: "Fournisseur ABC"
   *               telephone:
   *                 type: string
   *                 minLength: 7
   *                 description: Numéro de téléphone du fournisseur
   *                 example: "+33123456789"
   *               adresse:
   *                 type: string
   *                 minLength: 2
   *                 maxLength: 255
   *                 description: Adresse du fournisseur
   *                 example: "123 Rue de Paris, 75000 Paris"
   *     responses:
   *       201:
   *         description: Fournisseur créé avec succès
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
   *                   example: "Fournisseur créé avec succès"
   *                 data:
   *                   $ref: '#/components/schemas/Fournisseur'
   *       400:
   *         description: Erreur de validation
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Erreur de validation"
   *                 errors:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       field:
   *                         type: string
   *                       message:
   *                         type: string
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
   *       409:
   *         description: Conflit - Fournisseur déjà existant
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
   *                   example: "Un fournisseur avec ce numéro de téléphone existe déjà"
   *       500:
   *         description: Erreur serveur
   */
  router.post(
    '/',
    validate(createFournisseurSchema),
    controller.create.bind(controller)
  );

  /**
   * @swagger
   * /api/fournisseurs:
   *   get:
   *     summary: Récupérer tous les fournisseurs
   *     tags: [Fournisseurs]
   *     description: Récupère la liste de tous les fournisseurs
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Liste des fournisseurs récupérée avec succès
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
   *                   example: "Fournisseurs récupérés avec succès"
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Fournisseur'
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
   * /api/fournisseurs/{id}:
   *   get:
   *     summary: Récupérer un fournisseur par ID
   *     tags: [Fournisseurs]
   *     description: Récupère un fournisseur spécifique par son ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID du fournisseur
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     responses:
   *       200:
   *         description: Fournisseur récupéré avec succès
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
   *                   example: "Fournisseur récupéré avec succès"
   *                 data:
   *                   $ref: '#/components/schemas/Fournisseur'
   *       400:
   *         description: ID invalide
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
   *                   example: "ID invalide - doit être un UUID valide"
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
   *         description: Fournisseur non trouvé
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
   *                   example: "Fournisseur non trouvé"
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
   * /api/fournisseurs/{id}:
   *   put:
   *     summary: Mettre à jour un fournisseur
   *     tags: [Fournisseurs]
   *     description: Met à jour un fournisseur existant
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID du fournisseur
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nom:
   *                 type: string
   *                 minLength: 2
   *                 maxLength: 100
   *                 description: Nom du fournisseur
   *                 example: "Fournisseur ABC Modifié"
   *               telephone:
   *                 type: string
   *                 minLength: 7
   *                 description: Numéro de téléphone du fournisseur
   *                 example: "+33987654321"
   *               adresse:
   *                 type: string
   *                 minLength: 2
   *                 maxLength: 255
   *                 description: Adresse du fournisseur
   *                 example: "456 Avenue Modifiée, 69000 Lyon"
   *     responses:
   *       200:
   *         description: Fournisseur mis à jour avec succès
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
   *                   example: "Fournisseur mis à jour avec succès"
   *                 data:
   *                   $ref: '#/components/schemas/Fournisseur'
   *       400:
   *         description: Erreur de validation
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Erreur de validation"
   *                 errors:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       field:
   *                         type: string
   *                       message:
   *                         type: string
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
   *         description: Fournisseur non trouvé
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
   *                   example: "Fournisseur non trouvé"
   *       409:
   *         description: Conflit - Numéro de téléphone déjà utilisé
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
   *                   example: "Un fournisseur avec ce numéro de téléphone existe déjà"
   *       500:
   *         description: Erreur serveur
   */
  router.put(
    '/:id',
    validate(
      z.object({
        id: z.string().uuid('ID invalide - doit être un UUID valide'),
      }),
      'params'
    ),
    validate(updateFournisseurSchema),
    controller.update.bind(controller)
  );

  /**
   * @swagger
   * /api/fournisseurs/{id}:
   *   delete:
   *     summary: Supprimer un fournisseur
   *     tags: [Fournisseurs]
   *     description: Supprime un fournisseur existant
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID du fournisseur
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     responses:
   *       200:
   *         description: Fournisseur supprimé avec succès
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
   *                   example: "Fournisseur supprimé avec succès"
   *                 data:
   *                   $ref: '#/components/schemas/Fournisseur'
   *       400:
   *         description: ID invalide
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
   *                   example: "ID invalide - doit être un UUID valide"
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
   *         description: Fournisseur non trouvé
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
   *                   example: "Fournisseur non trouvé"
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

export default createFournisseurRoutes;
