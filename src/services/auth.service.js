/**
 * Service pour les opérations d'authentification
 * Contient la logique métier de l'authentification
 */

import { hashPassword, comparePassword } from '../utils/hasher.utils.js';
import { generateToken } from '../config/jwt.js';
import { HttpError } from '../utils/http-error.utils.js';

/**
 * Service pour la gestion de l'authentification
 */
export class AuthService {
  /**
   * Crée une instance de AuthService
   * @param {AuthRepository} authRepository - Repository d'authentification
   */
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  /**
   * Inscription d'un administrateur
   * @param {Object} data - Données d'inscription
   * @param {string} data.email - Email du compte
   * @param {string} data.password - Mot de passe en clair
   * @returns {Promise<Object>} Utilisateur créé (sans password)
   */
  async registerAdmin(data) {
    // Vérifie si l'email existe déjà
    const exists = await this.authRepository.existsByEmail(data.email);
    if (exists) {
      throw new HttpError(409, 'Un compte avec cet email existe déjà');
    }

    // Hash le mot de passe
    const hashedPassword = await hashPassword(data.password);

    // Crée l'utilisateur
    const user = await this.authRepository.create({
      email: data.email,
      password: hashedPassword,
      role: 'ADMIN',
    });

    // Retourne l'utilisateur sans le mot de passe
    return this._formatUserResponse(user);
  }

  /**
   * Connexion d'un administrateur
   * @param {Object} credentials - Identifiants de connexion
   * @param {string} credentials.email - Email de l'utilisateur
   * @param {string} credentials.password - Mot de passe en clair
   * @returns {Promise<Object>} Token et données utilisateur
   */
  async login(credentials) {
    // Trouve l'utilisateur par email
    const user = await this.authRepository.findByEmail(credentials.email);
    if (!user) {
      throw new HttpError(401, 'Email ou mot de passe incorrect');
    }

    // Vérifie le mot de passe
    const isPasswordValid = await comparePassword(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new HttpError(401, 'Email ou mot de passe incorrect');
    }

    // Génère le token JWT
    const token = generateToken(user);

    // Retourne le token et les données utilisateur
    return {
      token,
      user: this._formatUserResponse(user),
    };
  }

  /**
   * Trouve un utilisateur par ID
   * @param {string} id - ID de l'utilisateur
   * @returns {Promise<Object>} Utilisateur trouvé (sans password)
   */
  async findById(id) {
    const user = await this.authRepository.findById(id);
    if (!user) {
      throw new HttpError(404, 'Utilisateur non trouvé');
    }
    return this._formatUserResponse(user);
  }

  /**
   * Formate la réponse utilisateur (masque le mot de passe)
   * @private
   * @param {Object} user - Utilisateur brut de la base
   * @returns {Object} Utilisateur formaté (sans password)
   */
  _formatUserResponse(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
