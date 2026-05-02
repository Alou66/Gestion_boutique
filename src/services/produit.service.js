/**
 * Service Produit
 * Gère la logique métier pour les opérations Produit
 * Étend BaseService pour les opérations CRUD de base
 */

import { BaseService } from './base.service.js';

export class ProduitService extends BaseService {
  /**
   * @param {import('../repositories/produit.repository.js').ProduitRepository} repository - Repository Produit
   */
  constructor(repository) {
    super(repository);
  }

  /**
   * Crée un nouveau produit avec validation métier
   * @param {Object} data - Données du produit
   * @param {Object} [imageData] - Données de l'image uploadée
   * @param {string} imageData.url - URL de l'image Cloudinary
   * @param {string} imageData.publicId - Public ID Cloudinary
   * @returns {Promise<Object>} Produit créé
   */
  async create(data, imageData = null) {
    // Vérifier l'unicité du libellé
    const libelleExiste = await this.repository.libelleExists(data.libelle);
    if (libelleExiste) {
      const error = new Error('Un produit avec ce libellé existe déjà');
      error.statusCode = 409;
      throw error;
    }

    // Ajouter l'URL de l'image si fournie
    if (imageData && imageData.url) {
      data.image = imageData.url;
    }

    return super.create(data);
  }

  /**
   * Met à jour un produit avec gestion de l'image
   * @param {string} id - ID du produit
   * @param {Object} data - Données de mise à jour
   * @param {Object} [imageData] - Nouvelles données de l'image
   * @returns {Promise<Object>} Produit mis à jour
   */
  async update(id, data, imageData = null) {
    // Si le libellé est modifié, vérifier l'unicité
    if (data.libelle) {
      const libelleExiste = await this.repository.libelleExists(data.libelle, id);
      if (libelleExiste) {
        const error = new Error('Un produit avec ce libellé existe déjà');
        error.statusCode = 409;
        throw error;
      }
    }

    // Si une nouvelle image est fournie
    if (imageData && imageData.url) {
      data.image = imageData.url;
    }

    return super.update(id, data);
  }

  /**
   * Supprime un produit et son image Cloudinary
   * @param {string} id - ID du produit
   * @returns {Promise<Object>} Produit supprimé
   */
  async delete(id) {
    const produit = await this.repository.findById(id);
    if (!produit) {
      const error = new Error('Produit non trouvé');
      error.statusCode = 404;
      throw error;
    }

    // Retourner le produit avec l'ancienne image pour le supprimer de Cloudinary
    const deleted = await this.repository.delete(id);
    deleted._oldImage = produit.image;

    return deleted;
  }

  /**
   * Incrémente le stock d'un produit
   * @param {string} id - ID du produit
   * @param {number} quantite - Quantité à ajouter
   * @returns {Promise<Object>} Produit mis à jour
   */
  async incrementStock(id, quantite = 1) {
    const produit = await this.repository.incrementStock(id, quantite);
    if (!produit) {
      const error = new Error('Produit non trouvé');
      error.statusCode = 404;
      throw error;
    }
    return produit;
  }

  /**
   * Décrémente le stock d'un produit
   * @param {string} id - ID du produit
   * @param {number} quantite - Quantité à retirer
   * @returns {Promise<Object>} Produit mis à jour
   * @throws {Error} Si stock insuffisant
   */
  async decrementStock(id, quantite = 1) {
    if (quantite <= 0) {
      const error = new Error('La quantité doit être supérieure à 0');
      error.statusCode = 400;
      throw error;
    }

    const produit = await this.repository.decrementStock(id, quantite);
    if (!produit) {
      const error = new Error('Produit non trouvé');
      error.statusCode = 404;
      throw error;
    }
    return produit;
  }

  /**
   * Récupère tous les produits avec leurs relations
   * @returns {Promise<Array>} Tableau de produits
   */
  async findAllWithRelations() {
    return this.repository.findAllWithRelations();
  }

  /**
   * Récupère un produit par ID avec ses relations
   * @param {string} id - ID du produit
   * @returns {Promise<Object>} Produit avec relations
   */
  async findByIdWithRelations(id) {
    const produit = await this.repository.findByIdWithRelations(id);
    if (!produit) {
      const error = new Error('Produit non trouvé');
      error.statusCode = 404;
      throw error;
    }
    return produit;
  }

  /**
   * Recherche des produits par libelle
   * @param {string} searchTerm - Terme de recherche
   * @returns {Promise<Array>} Produits correspondants
   */
  async search(searchTerm) {
    if (!searchTerm || searchTerm.trim().length < 2) {
      const error = new Error('Le terme de recherche doit contenir au moins 2 caractères');
      error.statusCode = 400;
      throw error;
    }
    return this.repository.searchByLibelle(searchTerm);
  }
}
