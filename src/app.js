/**
 * Express Application Setup
 * Configures middleware, routes, and error handling
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { notFoundHandler } from './middlewares/error-handler.middleware.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';
import { swaggerUiOptions } from './config/swagger.config.js';
import specs from './config/swagger.config.js';

// Import route creators
import createFournisseurRoutes from './routes/fournisseur.routes.js';
import createProduitRoutes from './routes/produit.routes.js';

// Import repositories and services
import { PrismaClient } from '@prisma/client';
import { FournisseurRepository } from './repositories/fournisseur.repository.js';
import { FournisseurService } from './services/fournisseur.service.js';
import FournisseurController from './controllers/fournisseur.controller.js';
import { ProduitRepository } from './repositories/produit.repository.js';
import { ProduitService } from './services/produit.service.js';
import ProduitController from './controllers/produit.controller.js';

/**
 * Creates and configures the Express application
 * @returns {express.Application} Configured Express app
 */
export const createApp = () => {
  const app = express();

  // Initialize Prisma client
  const prisma = new PrismaClient();

  // Initialize repositories
  const fournisseurRepository = new FournisseurRepository(prisma);
  const produitRepository = new ProduitRepository(prisma);

  // Initialize services
  const fournisseurService = new FournisseurService(fournisseurRepository);
  const produitService = new ProduitService(produitRepository);

  // Initialize controllers
  const fournisseurController = new FournisseurController(fournisseurService);
  const produitController = new ProduitController(produitService);

  // Configure middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(morgan('dev'));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Server is healthy',
      data: {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
    });
  });

  // API routes
  app.use('/api/fournisseurs', createFournisseurRoutes(fournisseurController));
  app.use('/api/produits', createProduitRoutes(produitController));

  // Swagger documentation
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, swaggerUiOptions)
  );

  // 404 Handler
  app.use(notFoundHandler);

  // Error Handler
  app.use(errorHandler);

  return app;
};
