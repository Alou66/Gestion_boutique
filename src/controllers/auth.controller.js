/**
 * Controller pour les opérations d'authentification
 * Gère les requêtes HTTP pour l'authentification
 */

import { validate } from '../middlewares/validate.middleware.js';
import { registerAdminSchema, loginSchema } from '../validations/auth.validation.js';
import { success, created } from '../utils/response.utils.js';

/**
 * Controller pour la gestion de l'authentification
 */
export default class AuthController {
  /**
   * Crée une instance de AuthController
   * @param {AuthService} authService - Service d'authentification
   */
  constructor(authService) {
    this.authService = authService;
  }

  /**
   * Inscription d'un administrateur
   * POST /api/auth/register
   * @param {express.Request} req - Requête Express
   * @param {express.Response} res - Réponse Express
   * @param {express.NextFunction} next - Fonction next d'Express
   */
  async register(req, res, next) {
    try {
      const user = await this.authService.registerAdmin(req.body);
      created(res, 'Administrateur créé avec succès', user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Connexion d'un administrateur
   * POST /api/auth/login
   * @param {express.Request} req - Requête Express
   * @param {express.Response} res - Réponse Express
   * @param {express.NextFunction} next - Fonction next d'Express
   */
  async login(req, res, next) {
    try {
      const result = await this.authService.login(req.body);
      success(res, 'Connexion réussie', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupération du profil utilisateur connecté
   * GET /api/auth/profile
   * @param {express.Request} req - Requête Express
   * @param {express.Response} res - Réponse Express
   * @param {express.NextFunction} next - Fonction next d'Express
   */
  async profile(req, res, next) {
    try {
      const user = await this.authService.findById(req.user.id);
      success(res, 'Profil utilisateur', user);
    } catch (error) {
      next(error);
    }
  }
}
