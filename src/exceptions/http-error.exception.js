/**
 * HTTP Error Exception
 * Custom error class for HTTP errors with status codes
 */
export class HttpError extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} [statusCode=500] - HTTP status code
   * @param {Object} [details] - Additional error details
   */
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.details = details;
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create a Bad Request error (400)
   * @param {string} [message='Bad Request'] - Error message
   * @param {Object} [details] - Additional error details
   * @returns {HttpError}
   */
  static badRequest(message = 'Bad Request', details = null) {
    return new HttpError(message, 400, details);
  }

  /**
   * Create an Unauthorized error (401)
   * @param {string} [message='Unauthorized'] - Error message
   * @returns {HttpError}
   */
  static unauthorized(message = 'Unauthorized') {
    return new HttpError(message, 401);
  }

  /**
   * Create a Forbidden error (403)
   * @param {string} [message='Forbidden'] - Error message
   * @returns {HttpError}
   */
  static forbidden(message = 'Forbidden') {
    return new HttpError(message, 403);
  }

  /**
   * Create a Not Found error (404)
   * @param {string} [message='Not Found'] - Error message
   * @returns {HttpError}
   */
  static notFound(message = 'Not Found') {
    return new HttpError(message, 404);
  }

  /**
   * Create a Conflict error (409)
   * @param {string} [message='Conflict'] - Error message
   * @returns {HttpError}
   */
  static conflict(message = 'Conflict') {
    return new HttpError(message, 409);
  }

  /**
   * Create an Internal Server Error (500)
   * @param {string} [message='Internal Server Error'] - Error message
   * @returns {HttpError}
   */
  static internal(message = 'Internal Server Error') {
    return new HttpError(message, 500);
  }
}
