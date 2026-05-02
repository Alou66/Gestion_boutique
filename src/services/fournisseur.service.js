import { BaseService } from './base.service.js';

/**
 * Fournisseur Service - Business logic for Fournisseur operations
 * Extends BaseService with Fournisseur-specific logic
 */
export class FournisseurService extends BaseService {
  /**
   * @param {import('../repositories/fournisseur.repository.js').FournisseurRepository} repository - Fournisseur repository instance
   */
  constructor(repository) {
    super(repository);
  }

  /**
   * Create a new fournisseur with duplicate check
   * @param {Object} data - Fournisseur data
   * @param {string} data.nom - Fournisseur name
   * @param {string} data.telephone - Fournisseur telephone
   * @param {string} data.adresse - Fournisseur address
   * @returns {Promise<Object>} Created fournisseur
   * @throws {Error} If fournisseur with same telephone already exists
   */
  async create(data) {
    const { telephone } = data;

    // Check for duplicate telephone
    const existingFournisseur = await this.repository.findByTelephone(telephone);
    if (existingFournisseur) {
      const error = new Error('Un fournisseur avec ce numéro de téléphone existe déjà');
      error.statusCode = 409;
      throw error;
    }

    return super.create(data);
  }

  /**
   * Update a fournisseur with duplicate check
   * @param {string} id - Fournisseur ID
   * @param {Object} data - Data to update
   * @returns {Promise<Object>} Updated fournisseur
   * @throws {Error} If fournisseur not found or telephone already in use
   */
  async update(id, data) {
    const record = await this.repository.findById(id);
    if (!record) {
      const error = new Error('Fournisseur non trouvé');
      error.statusCode = 404;
      throw error;
    }

    // Check for duplicate telephone if it's being updated
    if (data.telephone && data.telephone !== record.telephone) {
      const existingFournisseur = await this.repository.findByTelephone(data.telephone);
      if (existingFournisseur) {
        const error = new Error('Un fournisseur avec ce numéro de téléphone existe déjà');
        error.statusCode = 409;
        throw error;
      }
    }

    return this.repository.update(id, data);
  }

  /**
   * Find fournisseur by telephone
   * @param {string} telephone - Telephone number
   * @returns {Promise<Object|null>} Found fournisseur or null
   */
  async findByTelephone(telephone) {
    return this.repository.findByTelephone(telephone);
  }

  /**
   * Find all fournisseurs with their approvisionnements
   * @returns {Promise<Array>} Array of fournisseurs with approvisionnements
   */
  async findAllWithApprovisionnements() {
    return this.repository.findWithApprovisionnements();
  }

  /**
   * Find fournisseur by ID with relations
   * @param {string} id - Fournisseur ID
   * @returns {Promise<Object>} Found fournisseur with relations
   * @throws {Error} If fournisseur not found
   */
  async findByIdWithRelations(id) {
    const fournisseur = await this.repository.findByIdWithRelations(id);
    if (!fournisseur) {
      const error = new Error('Fournisseur non trouvé');
      error.statusCode = 404;
      throw error;
    }
    return fournisseur;
  }
}
