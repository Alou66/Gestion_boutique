/**
 * Configuration Swagger pour la documentation API
 */

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

/**
 * Options de configuration Swagger
 */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gestion Boutique API',
      version: '1.0.0',
      description: 'API RESTful pour la gestion d\'une boutique avec fournisseurs, produits et approvisionnements',
      contact: {
        name: 'Support API',
        email: 'support@gestion-boutique.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Serveur de développement',
      },
    ],
    tags: [
      {
        name: 'Fournisseurs',
        description: 'Opérations CRUD pour la gestion des fournisseurs',
      },
      {
        name: 'Produits',
        description: 'Opérations CRUD pour la gestion des produits',
      },
      {
        name: 'Approvisionnements',
        description: 'Gestion des approvisionnements de produits',
      },
    ],
    components: {
      schemas: {
        Fournisseur: {
          type: 'object',
          required: ['nom', 'telephone', 'adresse'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Identifiant unique du fournisseur',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            nom: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'Nom du fournisseur',
              example: 'Fournisseur ABC',
            },
            telephone: {
              type: 'string',
              description: 'Numéro de téléphone du fournisseur',
              example: '+33123456789',
            },
            adresse: {
              type: 'string',
              minLength: 2,
              maxLength: 255,
              description: 'Adresse du fournisseur',
              example: '123 Rue de Paris, 75000 Paris',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création',
              example: '2026-01-01T12:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de dernière mise à jour',
              example: '2026-01-01T12:00:00.000Z',
            },
            approvisionnements: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Approvisionnement',
              },
            },
          },
        },
        Produit: {
          type: 'object',
          required: ['libelle', 'prixUnitaire', 'quantiteStock'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Identifiant unique du produit',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            libelle: {
              type: 'string',
              minLength: 2,
              description: 'Nom du produit',
              example: 'Produit A',
            },
            prixUnitaire: {
              type: 'number',
              format: 'float',
              minimum: 0,
              description: 'Prix unitaire du produit',
              example: 19.99,
            },
            quantiteStock: {
              type: 'integer',
              minimum: 0,
              description: 'Quantité en stock',
              example: 100,
            },
            image: {
              type: 'string',
              description: 'URL de l\'image du produit',
              example: 'https://example.com/image.jpg',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création',
              example: '2026-01-01T12:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de dernière mise à jour',
              example: '2026-01-01T12:00:00.000Z',
            },
          },
        },
        Approvisionnement: {
          type: 'object',
          required: ['fournisseurId', 'produitId', 'quantite'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Identifiant unique de l\'approvisionnement',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Date de l\'approvisionnement',
              example: '2026-01-01T12:00:00.000Z',
            },
            quantite: {
              type: 'integer',
              minimum: 1,
              description: 'Quantité approvisionnée',
              example: 50,
            },
            fournisseurId: {
              type: 'string',
              format: 'uuid',
              description: 'ID du fournisseur',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            produitId: {
              type: 'string',
              format: 'uuid',
              description: 'ID du produit',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création',
              example: '2026-01-01T12:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de dernière mise à jour',
              example: '2026-01-01T12:00:00.000Z',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Erreur de validation',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(swaggerOptions);

/**
 * Configuration Swagger UI
 */
export const swaggerUiOptions = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none; }',
  customSiteTitle: 'Gestion Boutique API Documentation',
};

export default specs;
