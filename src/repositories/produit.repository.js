/**
 * Repository Produit
 * Gère l'accès aux données pour l'entité Produit
 * Étend BaseRepository pour les opérations CRUD de base
 */

import { BaseRepository } from './base.repository.js';

export class ProduitRepository extends BaseRepository {
  /**
   * @param {Object} prismaClient - Client Prisma
   */
  constructor(prismaClient) {
    super(prismaClient.produit);
    this.prisma = prismaClient;
  }

  /**
   * Trouve un produit avec ses approvisionnements
   * @param {string} id - ID du produit
   * @returns {Promise<Object|null>} Produit avec relations
   */
  async findByIdWithRelations(id) {
    return this.findById(id, {
      include: {
        approvisionnements: {
          include: {
            fournisseur: true,
          },
          orderBy: {
            date: 'desc',
          },
        },
      },
    });
  }

  /**
   * Récupère tous les produits avec leurs relations
   * @returns {Promise<Array>} Tableau de produits
   */
  async findAllWithRelations() {
    return this.findAll({
      include: {
        _count: {
          select: {
            approvisionnements: true,
          },
        },
      },
      orderBy: {
        libelle: 'asc',
      },
    });
  }

  /**
   * Recherche des produits par libelle
   * @param {string} searchTerm - Terme de recherche
   * @returns {Promise<Array>} Produits correspondants
   */
  async searchByLibelle(searchTerm) {
    return this.findAll({
      where: {
        libelle: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
    });
  }

  /**
   * Trouve un produit par libelle exact (insensible à la casse)
   * @param {string} libelle - Libellé à rechercher
   * @returns {Promise<Object|null>} Produit trouvé ou null
   */
  async findByLibelle(libelle) {
    return this.findOne({
      libelle: {
        equals: libelle,
        mode: 'insensitive',
      },
    });
  }

  /**
   * Vérifie si un libellé existe déjà (insensible à la casse)
   * @param {string} libelle - Libellé à vérifier
   * @param {string} [excludeId] - ID à exclure de la vérification (pour les mises à jour)
   * @returns {Promise<boolean>} True si le libellé existe déjà
   */
  async libelleExists(libelle, excludeId = null) {
    const where = {
      libelle: {
        equals: libelle,
        mode: 'insensitive',
      },
    };

    if (excludeId) {
      where.NOT = {
        id: excludeId,
      };
    }

    const count = await this.count(where);
    return count > 0;
  }

  /**
   * Incrémente le stock d'un produit
   * @param {string} id - ID du produit
   * @param {number} quantite - Quantité à ajouter (par défaut 1)
   * @returns {Promise<Object>} Produit mis à jour
   */
  async incrementStock(id, quantite = 1) {
    return this.updateStock(id, quantite);
  }

  /**
   * Décrémente le stock d'un produit
   * @param {string} id - ID du produit
   * @param {number} quantite - Quantité à retirer (par défaut 1)
   * @returns {Promise<Object>} Produit mis à jour
   * @throws {Error} Si le stock deviendrait négatif
   */
  async decrementStock(id, quantite = 1) {
    const produit = await this.findById(id);
    if (!produit) {
      const error = new Error('Produit non trouvé');
      error.statusCode = 404;
      throw error;
    }

    if (produit.quantiteStock - quantite < 0) {
      const error = new Error('Stock insuffisant');
      error.statusCode = 400;
      throw error;
    }

    return this.updateStock(id, -quantite);
  }

  /**
   * Met à jour le stock exact d'un produit
   * @param {string} id - ID du produit
   * @param {number} nouveauStock - Nouvelle quantité en stock
   * @returns {Promise<Object>} Produit mis à jour
   */
  async setStock(id, nouveauStock) {
    return this.update(id, { quantiteStock: nouveauStock });
  }
}
