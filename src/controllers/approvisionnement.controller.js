/**
 * Controller Approvisionnement
 * Gère les requêtes HTTP pour les opérations Approvisionnement
 * Fournit une couche légère entre HTTP et la logique métier
 */

import { successResponse, errorResponse } from '../utils/response.utils.js';

export default class ApprovisionnementController {
  /**
   * @param {import('../services/approvisionnement.service.js').ApprovisionnementService} service - Service Approvisionnement
   */
  constructor(service) {
    this.service = service;
  }

  /**
   * Crée un nouvel approvisionnement
   * POST /api/approvisionnements
   */
  async create(req, res, next) {
    try {
      const approvisionnement = await this.service.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Approvisionnement créé et stock mis à jour avec succès',
        data: approvisionnement,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupère tous les approvisionnements
   * GET /api/approvisionnements
   */
  async findAll(req, res, next) {
    try {
      const approvisionnements = await this.service.findAll();

      res.status(200).json({
        success: true,
        message: 'Approvisionnements récupérés avec succès',
        data: approvisionnements,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupère un approvisionnement par ID
   * GET /api/approvisionnements/:id
   */
  async findById(req, res, next) {
    try {
      const { id } = req.params;
      const approvisionnement = await this.service.findById(id);

      res.status(200).json({
        success: true,
        message: 'Approvisionnement récupéré avec succès',
        data: approvisionnement,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Supprime un approvisionnement
   * DELETE /api/approvisionnements/:id
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const approvisionnement = await this.service.delete(id);

      res.status(200).json({
        success: true,
        message: 'Approvisionnement supprimé avec succès',
        data: approvisionnement,
      });
    } catch (error) {
      next(error);
    }
  }
}
