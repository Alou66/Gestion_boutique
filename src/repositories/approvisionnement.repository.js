/**
 * Repository Approvisionnement
 * Gère l'accès aux données pour l'entité Approvisionnement
 * Étend BaseRepository pour les opérations CRUD de base
 */

import { BaseRepository } from './base.repository.js';

export class ApprovisionnementRepository extends BaseRepository {
  /**
   * @param {Object} prismaClient - Client Prisma
   */
  constructor(prismaClient) {
    super(prismaClient.approvisionnement);
    this.prisma = prismaClient;
  }

  /**
   * Crée un approvisionnement avec relations
   * @param {Object} data - Données de l'approvisionnement
   * @returns {Promise<Object>} Approvisionnement créé avec relations
   */
  async createWithRelations(data) {
    return this.model.create({
      data,
      include: {
        fournisseur: true,
        produit: true,
      },
    });
  }

  /**
   * Trouve un approvisionnement par ID avec relations
   * @param {string} id - ID de l'approvisionnement
   * @returns {Promise<Object|null>} Approvisionnement avec relations
   */
  async findByIdWithRelations(id) {
    return this.findById(id, {
      include: {
        fournisseur: true,
        produit: true,
      },
    });
  }

  /**
   * Récupère tous les approvisionnements avec relations
   * @returns {Promise<Array>} Tableau d'approvisionnements
   */
  async findAllWithRelations() {
    return this.findAll({
      include: {
        fournisseur: true,
        produit: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }
}
