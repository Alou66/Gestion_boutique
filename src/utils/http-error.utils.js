/**
 * Classe d'erreur HTTP personnalisée
 * Permet de créer des erreurs avec un statut HTTP spécifique
 */

/**
 * HttpError - Erreur HTTP personnalisée
 * @extends Error
 */
export class HttpError extends Error {
  /**
   * Crée une instance de HttpError
   * @param {number} status - Code statut HTTP
   * @param {string} message - Message d'erreur
   * @param {Object} [details] - Détails supplémentaires de l'erreur
   */
  constructor(status, message, details = undefined) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.details = details;
    
    // Maintenir la pile d'appels (stack trace) correcte
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }
  }
}

/**
 * Crée une erreur 400 Bad Request
 * @param {string} message - Message d'erreur
 * @param {Object} [details] - Détails supplémentaires
 * @returns {HttpError} Instance HttpError
 */
export const badRequestError = (message = 'Requête invalide', details = undefined) => {
  return new HttpError(400, message, details);
};

/**
 * Crée une erreur 401 Unauthorized
 * @param {string} message - Message d'erreur
 * @param {Object} [details] - Détails supplémentaires
 * @returns {HttpError} Instance HttpError
 */
export const unauthorizedError = (message = 'Non autorisé', details = undefined) => {
  return new HttpError(401, message, details);
};

/**
 * Crée une erreur 403 Forbidden
 * @param {string} message - Message d'erreur
 * @param {Object} [details] - Détails supplémentaires
 * @returns {HttpError} Instance HttpError
 */
export const forbiddenError = (message = 'Accès refusé', details = undefined) => {
  return new HttpError(403, message, details);
};

/**
 * Crée une erreur 404 Not Found
 * @param {string} message - Message d'erreur
 * @param {Object} [details] - Détails supplémentaires
 * @returns {HttpError} Instance HttpError
 */
export const notFoundError = (message = 'Ressource non trouvée', details = undefined) => {
  return new HttpError(404, message, details);
};

/**
 * Crée une erreur 409 Conflict
 * @param {string} message - Message d'erreur
 * @param {Object} [details] - Détails supplémentaires
 * @returns {HttpError} Instance HttpError
 */
export const conflictError = (message = 'Conflit de ressource', details = undefined) => {
  return new HttpError(409, message, details);
};
