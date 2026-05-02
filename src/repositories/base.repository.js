/**
 * Base Repository - CRUD générique pour Prisma
 * Fournit des opérations de base réutilisables
 */

export class BaseRepository {
  /**
   * @param {Object} model - Modèle Prisma (ex: prisma.produit)
   */
  constructor(model) {
    if (!model) {
      throw new Error('Modèle Prisma requis pour BaseRepository');
    }
    this.model = model;
  }

  /**
   * Crée un nouvel enregistrement
   * @param {Object} data - Données à créer
   * @returns {Promise<Object>} Enregistrement créé
   */
  async create(data) {
    return this.model.create({ data });
  }

  /**
   * Récupère tous les enregistrements
   * @param {Object} [options] - Options de requête
   * @returns {Promise<Array>} Tableau d'enregistrements
   */
  async findAll(options = {}) {
    const { where, orderBy, include, select } = options;
    return this.model.findMany({ where, orderBy, include, select });
  }

  /**
   * Récupère un enregistrement par ID
   * @param {string} id - ID de l'enregistrement
   * @param {Object} [options] - Options de requête
   * @returns {Promise<Object|null>} Enregistrement trouvé ou null
   */
  async findById(id, options = {}) {
    const { include, select } = options;
    return this.model.findUnique({ where: { id }, include, select });
  }

  /**
   * Met à jour un enregistrement par ID
   * @param {string} id - ID de l'enregistrement
   * @param {Object} data - Données de mise à jour
   * @returns {Promise<Object>} Enregistrement mis à jour
   */
  async update(id, data) {
    return this.model.update({ where: { id }, data });
  }

  /**
   * Supprime un enregistrement par ID
   * @param {string} id - ID de l'enregistrement
   * @returns {Promise<Object>} Enregistrement supprimé
   */
  async delete(id) {
    return this.model.delete({ where: { id } });
  }

  /**
   * Compte les enregistrements
   * @param {Object} [where] - Filtre de comptage
   * @returns {Promise<number>} Nombre d'enregistrements
   */
  async count(where) {
    return this.model.count({ where });
  }

  /**
   * Vérifie si un enregistrement existe
   * @param {string} id - ID de l'enregistrement
   * @returns {Promise<boolean>} True si existe
   */
  async exists(id) {
    const record = await this.findById(id, { select: { id: true } });
    return !!record;
  }

  /**
   * Met à jour le stock d'un produit
   * @param {string} id - ID du produit
   * @param {number} quantite - Quantité à ajouter (positive) ou retirer (négative)
   * @returns {Promise<Object>} Produit mis à jour
   */
  async updateStock(id, quantite) {
    return this.model.update({
      where: { id },
      data: {
        quantiteStock: { increment: quantite },
      },
    });
  }
}
