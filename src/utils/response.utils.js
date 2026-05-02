/**
 * Response utility functions
 * Standardized API response format
 */

/**
 * Send a successful response
 * @param {Object} res - Express response object
 * @param {Object} data - Response data
 * @param {string} [message='Success'] - Success message
 * @param {number} [statusCode=200] - HTTP status code
 * @returns {Object} JSON response
 */
export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {string|Error} error - Error message or Error object
 * @param {number} [statusCode=500] - HTTP status code
 * @param {Object} [details] - Additional error details
 * @returns {Object} JSON response
 */
export const errorResponse = (res, error, statusCode = 500, details = null) => {
  const message = error instanceof Error ? error.message : error;
  
  const response = {
    success: false,
    message,
  };

  if (details) {
    response.details = details;
  }

  if (process.env.NODE_ENV === 'development') {
    response.stack = error instanceof Error ? error.stack : undefined;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send a not found response
 * @param {Object} res - Express response object
 * @param {string} [resource='Resource'] - Resource name
 * @returns {Object} JSON response
 */
export const notFoundResponse = (res, resource = 'Resource') => {
  return res.status(404).json({
    success: false,
    message: `${resource} not found`,
    data: null,
  });
};

/**
 * Send a validation error response
 * @param {Object} res - Express response object
 * @param {Array} errors - Validation errors array
 * @returns {Object} JSON response
 */
export const validationErrorResponse = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors,
    data: null,
  });
};
