/**
 * Global Error Handler Middleware
 * Handles all errors and sends formatted error responses
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    statusCode: err.statusCode || 500,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    body: req.method === 'POST' || req.method === 'PUT' ? req.body : undefined,
  });

  // Default error response
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details || null;

  // Handle Zod validation errors
  if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation failed';
    details = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  }

  // Handle Prisma errors
  if (err.code) {
    switch (err.code) {
      case 'P2002':
        // Unique constraint violation
        statusCode = 409;
        message = 'A record with this value already exists';
        if (err.meta?.target) {
          message = `Duplicate value for: ${err.meta.target}`;
        }
        details = { constraint: err.meta?.target };
        break;
      case 'P2025':
        // Record not found
        statusCode = 404;
        message = 'Record not found';
        break;
      default:
        // Log Prisma errors for debugging
        console.error('Prisma Error:', err);
    }
  }

  // Handle express-validator errors
  if (err.type === 'validation') {
    statusCode = 400;
    message = 'Validation failed';
    details = err.errors;
  }

  // Don't leak stack trace in production
  const response = {
    success: false,
    message,
  };

  if (details) {
    response.details = details;
  }

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

/**
 * 404 Not Found Handler
 * Handles requests to undefined routes
 */
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};
