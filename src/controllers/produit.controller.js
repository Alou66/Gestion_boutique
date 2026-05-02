/**
 * Controller Produit
 * Gère les requêtes HTTP pour les opérations Produit
 * Fournit une couche légère entre HTTP et la logique métier
 */

import { extractPublicIdFromUrl } from '../config/cloudinary.js';

export default class ProduitController {
  /**
   * @param {import('../services/produit.service.js').ProduitService} service - Service Produit
   */
  constructor(service) {
    this.service = service;
  }

  /**
   * Crée un nouveau produit
   * POST /api/produits
   */
  async create(req, res, next) {
    try {
      const imageData = req.file ? {
        url: req.file.cloudinaryUrl,
        publicId: req.file.cloudinaryPublicId,
      } : null;

      const produit = await this.service.create(req.body, imageData);

      res.status(201).json({
        success: true,
        message: 'Produit créé avec succès',
        data: produit,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Met à jour un produit
   * PUT /api/produits/:id
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const imageData = req.file ? {
        url: req.file.cloudinaryUrl,
        publicId: req.file.cloudinaryPublicId,
      } : null;

      const produit = await this.service.update(id, req.body, imageData);

      res.status(200).json({
        success: true,
        message: 'Produit mis à jour avec succès',
        data: produit,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupère tous les produits
   * GET /api/produits
   */
  async findAll(req, res, next) {
    try {
      const produits = await this.service.findAll();

      res.status(200).json({
        success: true,
        message: 'Produits récupérés avec succès',
        data: produits,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupère un produit par ID
   * GET /api/produits/:id
   */
  async findById(req, res, next) {
    try {
      const { id } = req.params;
      const produit = await this.service.findById(id);

      res.status(200).json({
        success: true,
        message: 'Produit récupéré avec succès',
        data: produit,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Met à jour un produit
   * PUT /api/produits/:id
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const imageData = req.file ? {
        url: req.file.cloudinaryUrl,
        publicId: req.file.cloudinaryPublicId,
      } : null;

      const produit = await this.service.update(id, req.body, imageData);

      res.status(200).json({
        success: true,
        message: 'Produit mis à jour avec succès',
        data: produit,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Supprime un produit
   * DELETE /api/produits/:id
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const produit = await this.service.delete(id);

      // Extraire le public_id de l'ancienne image
      const publicId = produit._oldImage ? extractPublicIdFromUrl(produit._oldImage) : null;

      res.status(200).json({
        success: true,
        message: 'Produit supprimé avec succès',
        data: {
          ...produit,
          _cloudinaryPublicId: publicId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Incrémente le stock d'un produit
   * PATCH /api/produits/:id/increment
   */
  async incrementStock(req, res, next) {
    try {
      const { id } = req.params;
      const { quantite = 1 } = req.body;

      const produit = await this.service.incrementStock(id, quantite);

      res.status(200).json({
        success: true,
        message: 'Stock incrémenté avec succès',
        data: produit,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Décrémente le stock d'un produit
   * PATCH /api/produits/:id/decrement
   */
  async decrementStock(req, res, next) {
    try {
      const { id } = req.params;
      const { quantite = 1 } = req.body;

      const produit = await this.service.decrementStock(id, quantite);

      res.status(200).json({
        success: true,
        message: 'Stock décrémenté avec succès',
        data: produit,
      });
    } catch (error) {
      next(error);
    }
  }
}
