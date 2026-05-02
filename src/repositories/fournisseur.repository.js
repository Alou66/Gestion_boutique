import { BaseRepository } from './base.repository.js';

/**
 * Fournisseur Repository - Handles data access for Fournisseur model
 * Extends BaseRepository with Fournisseur-specific operations
 */
export class FournisseurRepository extends BaseRepository {
  /**
   * @param {Object} prismaClient - Prisma client instance
   */
  constructor(prismaClient) {
    super(prismaClient.fournisseur);
    this.prisma = prismaClient;
  }

  /**
   * Find fournisseur by telephone
   * @param {string} telephone - Telephone number
   * @returns {Promise<Object|null>} Found fournisseur or null
   */
  async findByTelephone(telephone) {
    return this.findOne({ telephone });
  }

  /**
   * Find fournisseurs with approvisionnements
   * @returns {Promise<Array>} Array of fournisseurs with approvisionnements
   */
  async findWithApprovisionnements() {
    return this.findAll({
      include: {
        approvisionnements: {
          include: {
            produit: true,
          },
        },
      },
      orderBy: {
        nom: 'asc',
      },
    });
  }

  /**
   * Find fournisseur by ID with approvisionnements
   * @param {string} id - Fournisseur ID
   * @returns {Promise<Object|null>} Found fournisseur or null
   */
  async findByIdWithRelations(id) {
    return this.findById(id, {
      include: {
        approvisionnements: {
          include: {
            produit: true,
          },
        },
      },
    });
  }
}
