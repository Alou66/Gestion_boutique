/**
 * Repository pour les opérations d'authentification
 * Accède aux données utilisateur via Prisma
 */

/**
 * Repository pour la gestion des utilisateurs
 */
export class AuthRepository {
  /**
   * Crée une instance de AuthRepository
   * @param {import('@prisma/client').PrismaClient} prisma - Client Prisma
   */
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * Trouve un utilisateur par son email
   * @param {string} email - Email de l'utilisateur
   * @returns {Promise<Object|null>} Utilisateur trouvé ou null
   */
  async findByEmail(email) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Trouve un utilisateur par son ID
   * @param {string} id - ID de l'utilisateur
   * @returns {Promise<Object|null>} Utilisateur trouvé ou null
   */
  async findById(id) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Crée un nouvel utilisateur
   * @param {Object} data - Données de l'utilisateur
   * @param {string} data.email - Email de l'utilisateur
   * @param {string} data.password - Mot de passe hashé
   * @param {string} [data.role='ADMIN'] - Rôle de l'utilisateur
   * @returns {Promise<Object>} Utilisateur créé
   */
  async create(data) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: data.role || 'ADMIN',
      },
    });
  }

  /**
   * Vérifie si un email existe déjà
   * @param {string} email - Email à vérifier
   * @returns {Promise<boolean>} true si l'email existe
   */
  async existsByEmail(email) {
    const count = await this.prisma.user.count({
      where: { email },
    });
    return count > 0;
  }
}
