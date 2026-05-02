import { FournisseurService } from '../services/fournisseur.service.js';

/**
 * Fournisseur Controller - Handles HTTP requests for Fournisseur operations
 * Provides clean separation between HTTP layer and business logic
 */
export default class FournisseurController {
  /**
   * @param {FournisseurService} service - Fournisseur service instance
   */
  constructor(service) {
    this.service = service;
  }

  /**
   * Create a new fournisseur
   * POST /api/fournisseurs
   */
  async create(req, res, next) {
    try {
      const fournisseur = await this.service.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Fournisseur créé avec succès',
        data: fournisseur,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Find all fournisseurs
   * GET /api/fournisseurs
   */
  async findAll(req, res, next) {
    try {
      const fournisseurs = await this.service.findAll();

      res.status(200).json({
        success: true,
        message: 'Fournisseurs récupérés avec succès',
        data: fournisseurs,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Find fournisseur by ID
   * GET /api/fournisseurs/:id
   */
  async findById(req, res, next) {
    try {
      const { id } = req.params;
      const fournisseur = await this.service.findById(id);

      res.status(200).json({
        success: true,
        message: 'Fournisseur récupéré avec succès',
        data: fournisseur,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update fournisseur by ID
   * PUT /api/fournisseurs/:id
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const fournisseur = await this.service.update(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Fournisseur mis à jour avec succès',
        data: fournisseur,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete fournisseur by ID
   * DELETE /api/fournisseurs/:id
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const fournisseur = await this.service.delete(id);

      res.status(200).json({
        success: true,
        message: 'Fournisseur supprimé avec succès',
        data: fournisseur,
      });
    } catch (error) {
      next(error);
    }
  }
}
