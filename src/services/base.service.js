/**
 * Base Service - Logique métier générique
 * Fournit des opérations métier réutilisables
 */

export class BaseService {
  /**
   * @param {BaseRepository} repository - Repository instance
   */
  constructor(repository) {
    if (!repository) {
      throw new Error('Repository requise pour BaseService');
    }
    this.repository = repository;
  }

  /**
   * Crée un nouvel enregistrement
   * @param {Object} data - Données à créer
   * @returns {Promise<Object>} Enregistrement créé
   */
  async create(data) {
    return this.repository.create(data);
  }

  /**
   * Récupère tous les enregistrements
   * @param {Object} [options] - Options de requête
   * @returns {Promise<Array>} Tableau d'enregistrements
   */
  async findAll(options = {}) {
    return this.repository.findAll(options);
  }

  /**
   * Récupère un enregistrement par ID
   * @param {string} id - ID de l'enregistrement
   * @returns {Promise<Object>} Enregistrement trouvé
   * @throws {Error} Si l'enregistrement n'est pas trouvé
   */
  async findById(id) {
    const record = await this.repository.findById(id);
    if (!record) {
      const error = new Error('Enregistrement non trouvé');
      error.statusCode = 404;
      throw error;
    }
    return record;
  }

  /**
   * Met à jour un enregistrement par ID
   * @param {string} id - ID de l'enregistrement
   * @param {Object} data - Données de mise à jour
   * @returns {Promise<Object>} Enregistrement mis à jour
   * @throws {Error} Si l'enregistrement n'est pas trouvé
   */
  async update(id, data) {
    const record = await this.repository.findById(id);
    if (!record) {
      const error = new Error('Enregistrement non trouvé');
      error.statusCode = 404;
      throw error;
    }
    return this.repository.update(id, data);
  }

  /**
   * Supprime un enregistrement par ID
   * @param {string} id - ID de l'enregistrement
   * @returns {Promise<Object>} Enregistrement supprimé
   * @throws {Error} Si l'enregistrement n'est pas trouvé
   */
  async delete(id) {
    const record = await this.repository.findById(id);
    if (!record) {
      const error = new Error('Enregistrement non trouvé');
      error.statusCode = 404;
      throw error;
    }
    return this.repository.delete(id);
  }

  /**
   * Compte les enregistrements
   * @param {Object} [where] - Filtre de comptage
   * @returns {Promise<number>} Nombre d'enregistrements
   */
  async count(where) {
    return this.repository.count(where);
  }
}
