/**
 * Middleware d'authentification JWT
 * Vérifie la présence et la validité du token JWT
 */

import { verifyToken } from '../config/jwt.js';
import { extractTokenFromHeader } from '../config/jwt.js';

/**
 * Middleware de protection des routes
 * Vérifie le token JWT dans l'en-tête Authorization
 * Injecte req.user avec les données décodées du token
 * Retourne 401 si le token est manquant, invalide ou expiré
 * 
 * @param {express.Request} req - Requête Express
 * @param {express.Response} res - Réponse Express
 * @param {express.NextFunction} next - Fonction next d'Express
 */
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    // Vérifie la présence du token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Accès refusé. Token manquant."
      });
    }

    // Vérifie la validité du token
    const decoded = verifyToken(token);

    // Injecte les données utilisateur dans la requête
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    // Token invalide ou expiré
    return res.status(401).json({
      success: false,
      message: "Accès refusé. Token invalide ou expiré."
    });
  }
};
