/**
 * Validation Approvisionnement - Schémas Zod
 * Valide les données des requêtes Approvisionnement
 */

import { z } from 'zod';

/**
 * Schéma de validation pour la création d'un approvisionnement
 */
export const createApprovisionnementSchema = z.object({
  fournisseurId: z
    .string()
    .uuid('ID du fournisseur invalide - doit être un UUID valide'),
  produitId: z
    .string()
    .uuid('ID du produit invalide - doit être un UUID valide'),
  quantite: z
    .coerce
    .number({
      required_error: 'La quantité est obligatoire',
      invalid_type_error: 'La quantité doit être un nombre',
    })
    .int({ message: 'La quantité doit être un entier' })
    .positive({ message: 'La quantité doit être supérieure à 0' }),
  date: z
    .string()
    .datetime({ message: 'La date doit être au format ISO 8601' })
    .optional(),
});

/**
 * Options de validation Zod
 */
export const validatorOptions = {
  abortEarly: false, // Collecte toutes les erreurs
  stripUnknown: true, // Supprime les champs inconnus
};
