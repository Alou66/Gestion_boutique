/**
 * Configuration JWT
 * Génération et vérification des tokens JSON Web Token
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '1d'; // 1 jour

if (!JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET n\'est pas défini dans les variables d\'environnement');
}

/**
 * Génère un token JWT pour un utilisateur
 * @param {Object} user - Objet utilisateur
 * @param {string} user.id - ID de l'utilisateur
 * @param {string} user.email - Email de l'utilisateur
 * @param {string} user.role - Rôle de l'utilisateur
 * @returns {string} Token JWT signé
 */
export const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Vérifie et décode un token JWT
 * @param {string} token - Token JWT à vérifier
 * @returns {Object} Payload décodé du token
 * @throws {Error} Si le token est invalide ou expiré
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const error = new Error('Token expiré');
      error.status = 401;
      throw error;
    }
    if (error.name === 'JsonWebTokenError') {
      const error = new Error('Token invalide');
      error.status = 401;
      throw error;
    }
    throw error;
  }
};

/**
 * Extrait le token depuis l'en-tête Authorization
 * @param {string} authHeader - En-tête Authorization (ex: "Bearer token")
 * @returns {string|null} Token extrait ou null si non trouvé
 */
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // "Bearer ".length = 7
};
