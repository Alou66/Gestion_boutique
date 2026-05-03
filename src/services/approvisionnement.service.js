/**
 * Service Approvisionnement
 * Gère la logique métier pour les opérations Approvisionnement
 * Étend BaseService pour les opérations CRUD de base
 */

import { HttpError } from '../exceptions/http-error.exception.js';
import { BaseService } from './base.service.js';

export class ApprovisionnementService extends BaseService {
  /**
   * @param {import('../repositories/approvisionnement.repository.js').ApprovisionnementRepository} repository - Repository Approvisionnement
   * @param {import('../repositories/produit.repository.js').ProduitRepository} produitRepository - Repository Produit
   * @param {import('../repositories/fournisseur.repository.js').FournisseurRepository} fournisseurRepository - Repository Fournisseur
   */
  constructor(repository, produitRepository, fournisseurRepository) {
    super(repository);
    this.produitRepository = produitRepository;
    this.fournisseurRepository = fournisseurRepository;
  }

  /**
   * Crée un nouvel approvisionnement avec mise à jour du stock
   * Vérifie l'existence du fournisseur et du produit
   * Met à jour le stock du produit automatiquement
   * Tout est fait dans une logique métier cohérente
   * @param {Object} data - Données de l'approvisionnement
   * @returns {Promise<Object>} Approvisionnement créé avec relations
   */
  async create(data) {
    const { fournisseurId, produitId, quantite, date } = data;

    // 1. Vérifier que le fournisseur existe
    const fournisseurExiste = await this.fournisseurRepository.exists(fournisseurId);
    if (!fournisseurExiste) {
      const error = new Error('Fournisseur non trouvé');
      error.statusCode = 404;
      throw error;
    }

    // 2. Vérifier que le produit existe
    const produit = await this.produitRepository.findById(produitId);
    if (!produit) {
      const error = new Error('Produit non trouvé');
      error.statusCode = 404;
      throw error;
    }

    // 3. Créer l'approvisionnement
    const nouvelApprovisionnement = await this.repository.createWithRelations({
      date,
      quantite,
      fournisseurId,
      produitId,
    });

    // 4. Mettre à jour le stock du produit (quantiteStock += quantite)
    const nouveauStock = produit.quantiteStock + quantite;
    await this.produitRepository.setStock(produitId, nouveauStock);

    // 5. Récupérer l'approvisionnement complet avec relations
    const approvisionnementComplet = await this.repository.findByIdWithRelations(
      nouvelApprovisionnement.id
    );

    return approvisionnementComplet;
  }

  /**
   * Récupère un approvisionnement par ID avec relations
   * @param {string} id - ID de l'approvisionnement
   * @returns {Promise<Object>} Approvisionnement avec relations
   */
  async findById(id) {
    const approvisionnement = await this.repository.findByIdWithRelations(id);
    if (!approvisionnement) {
      const error = new Error('Approvisionnement non trouvé');
      error.statusCode = 404;
      throw error;
    }
    return approvisionnement;
  }

  /**
   * Récupère tous les approvisionnements avec relations
   * @returns {Promise<Array>} Tableau d'approvisionnements
   */
  async findAll() {
    return this.repository.findAllWithRelations();
  }

  /**
   * Supprime un approvisionnement
   * NOTE : La logique métier ne réduit PAS le stock du produit
   * (car un approvisionnement validé ne doit pas être annulé facilement)
   * Cependant, on retourne les informations pour audit
   * @param {string} id - ID de l'approvisionnement
   * @returns {Promise<Object>} Approvisionnement supprimé
   */
  async delete(id) {
    const approvisionnement = await this.repository.findByIdWithRelations(id);
    if (!approvisionnement) {
      const error = new Error('Approvisionnement non trouvé');
      error.statusCode = 404;
      throw error;
    }

    // Supprimer l'approvisionnement
    await this.repository.delete(id);

    // Retourner les informations pour audit
    return {
      ...approvisionnement,
      message: 'Approvisionnement supprimé (le stock du produit n\'a pas été modifié)',
    };
  }
}
