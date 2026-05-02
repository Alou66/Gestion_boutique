import { Router } from 'express';
import { z } from 'zod';
import {
  createProduitSchema,
  updateProduitSchema,
  incrementStockSchema,
  decrementStockSchema,
} from '../validations/produit.validation.js';
import {
  validate,
} from '../middlewares/validate.middleware.js';
import uploadProduitImage, { uploadToCloudinary } from '../middlewares/upload.middleware.js';
import ProduitController from '../controllers/produit.controller.js';

/**
 * Middleware pour gérer l'upload Cloudinary
 */
const handleCloudinaryUpload = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const result = await uploadToCloudinary(req.file.buffer);
    req.file.cloudinaryUrl = result.url;
    req.file.cloudinaryPublicId = result.publicId;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Routes Produit - API REST
 * Définit toutes les routes pour les opérations Produit
 */

/**
 * Crée les routes pour les opérations Produit
 * @param {ProduitController} controller - Instance du controller Produit
 * @returns {Router} Router Express configuré
 */
const createProduitRoutes = (controller) => {
  const router = Router();

  /**
   * @swagger
   * tags:
   *   name: Produits
   *   description: Opérations CRUD pour la gestion des produits
   */

  /**
   * @swagger
   * /api/produits:
   *   post:
   *     summary: Créer un nouveau produit
   *     tags: [Produits]
   *     description: Crée un nouveau produit avec upload optionnel d'image
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - libelle
   *               - prixUnitaire
   *             properties:
   *               libelle:
   *                 type: string
   *                 minLength: 2
   *                 description: Nom du produit
   *                 example: "Produit A"
   *               prixUnitaire:
   *                 type: number
   *                 format: float
   *                 minimum: 0
   *                 exclusiveMinimum: true
   *                 description: Prix unitaire du produit
   *                 example: 19.99
   *               quantiteStock:
   *                 type: integer
   *                 minimum: 0
   *                 description: Quantité en stock
   *                 example: 100
   *               image:
   *                 type: string
   *                 format: binary
   *                 description: Image du produit (JPG, PNG, max 5MB)
   *     responses:
   *       201:
   *         description: Produit créé avec succès
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
   *                   example: "Produit créé avec succès"
   *                 data:
   *                   $ref: '#/components/schemas/Produit'
   *       400:
   *         description: Erreur de validation
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       413:
   *         description: Fichier trop volumineux
   *       415:
   *         description: Type de fichier non supporté
   *       500:
   *         description: Erreur serveur
   */
  router.post(
    '/',
    uploadProduitImage,
    handleCloudinaryUpload,
    validate(createProduitSchema),
    controller.create.bind(controller)
  );

  /**
   * @swagger
   * /api/produits:
   *   get:
   *     summary: Récupérer tous les produits
   *     tags: [Produits]
   *     description: Récupère la liste de tous les produits
   *     responses:
   *       200:
   *         description: Liste des produits récupérée avec succès
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
   *                   example: "Produits récupérés avec succès"
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Produit'
   *       500:
   *         description: Erreur serveur
   */
  router.get('/', controller.findAll.bind(controller));

  /**
   * @swagger
   * /api/produits/{id}:
   *   get:
   *     summary: Récupérer un produit par ID
   *     tags: [Produits]
   *     description: Récupère un produit spécifique par son ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID du produit
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     responses:
   *       200:
   *         description: Produit récupéré avec succès
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
   *                   example: "Produit récupéré avec succès"
   *                 data:
   *                   $ref: '#/components/schemas/Produit'
   *       400:
   *         description: ID invalide
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Produit non trouvé
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
   * /api/produits/{id}:
   *   put:
   *     summary: Mettre à jour un produit (complet)
   *     tags: [Produits]
   *     description: Met à jour entièrement un produit existant
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID du produit
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               libelle:
   *                 type: string
   *                 minLength: 2
   *                 description: Nom du produit
   *                 example: "Produit Modifié"
   *               prixUnitaire:
   *                 type: number
   *                 format: float
   *                 minimum: 0
   *                 exclusiveMinimum: true
   *                 description: Prix unitaire du produit
   *                 example: 29.99
   *               quantiteStock:
   *                 type: integer
   *                 minimum: 0
   *                 description: Quantité en stock
   *                 example: 50
   *               image:
   *                 type: string
   *                 format: binary
   *                 description: Nouvelle image du produit
   *     responses:
   *       200:
   *         description: Produit mis à jour avec succès
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
   *                   example: "Produit mis à jour avec succès"
   *                 data:
   *                   $ref: '#/components/schemas/Produit'
   *       400:
   *         description: Erreur de validation
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Produit non trouvé
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Erreur serveur
   */
  router.put(
    '/:id',
    uploadProduitImage,
    handleCloudinaryUpload,
    validate(
      z.object({
        id: z.string().uuid('ID invalide - doit être un UUID valide'),
      }),
      'params'
    ),
    validate(updateProduitSchema),
    controller.update.bind(controller)
  );

  /**
   * @swagger
   * /api/produits/{id}:
   *   delete:
   *     summary: Supprimer un produit
   *     tags: [Produits]
   *     description: Supprime un produit et son image Cloudinary
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID du produit
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     responses:
   *       200:
   *         description: Produit supprimé avec succès
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
   *                   example: "Produit supprimé avec succès"
   *                 data:
   *                   $ref: '#/components/schemas/Produit'
   *       400:
   *         description: ID invalide
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Produit non trouvé
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

  /**
   * @swagger
   * /api/produits/{id}/increment:
   *   patch:
   *     summary: Incrémenter le stock
   *     tags: [Produits]
   *     description: Incrémente la quantité en stock d'un produit
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID du produit
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     requestBody:
   *       required: false
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               quantite:
   *                 type: integer
   *                 minimum: 1
   *                 description: Quantité à ajouter
   *                 example: 10
   *     responses:
   *       200:
   *         description: Stock incrémenté avec succès
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
   *                   example: "Stock incrémenté avec succès"
   *                 data:
   *                   $ref: '#/components/schemas/Produit'
   *       400:
   *         description: Erreur de validation ou stock négatif
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Produit non trouvé
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Erreur serveur
   */
  router.patch(
    '/:id/increment',
    validate(
      z.object({
        id: z.string().uuid('ID invalide - doit être un UUID valide'),
      }),
      'params'
    ),
    validate(incrementStockSchema),
    controller.incrementStock.bind(controller)
  );

  /**
   * @swagger
   * /api/produits/{id}/decrement:
   *   patch:
   *     summary: Décrémenter le stock
   *     tags: [Produits]
   *     description: Décrémente la quantité en stock d'un produit
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID du produit
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     requestBody:
   *       required: false
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               quantite:
   *                 type: integer
   *                 minimum: 1
   *                 description: Quantité à retirer
   *                 example: 5
   *     responses:
   *       200:
   *         description: Stock décrémenté avec succès
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
   *                   example: "Stock décrémenté avec succès"
   *                 data:
   *                   $ref: '#/components/schemas/Produit'
   *       400:
   *         description: Erreur de validation ou stock négatif
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Produit non trouvé
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Erreur serveur
   */
  router.patch(
    '/:id/decrement',
    validate(
      z.object({
        id: z.string().uuid('ID invalide - doit être un UUID valide'),
      }),
      'params'
    ),
    validate(decrementStockSchema),
    controller.decrementStock.bind(controller)
  );

  return router;
};

export default createProduitRoutes;

