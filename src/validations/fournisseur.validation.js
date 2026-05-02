import { z } from 'zod';

/**
 * Fournisseur Validation Schemas
 * Using Zod for runtime type checking and validation
 */

/**
 * Validation schema for creating a fournisseur
 */
export const createFournisseurSchema = z.object({
  nom: z
    .string()
    .min(2, { message: 'Le nom doit contenir au moins 2 caractères' })
    .max(100, { message: 'Le nom ne doit pas dépasser 100 caractères' })
    .trim(),
  telephone: z
    .string()
    .min(1, { message: 'Le numéro de téléphone est obligatoire' })
    .regex(/^[+]?[0-9\s\-()]{7,}$/, {
      message: 'Le numéro de téléphone n\'est pas valide',
    })
    .trim(),
  adresse: z
    .string()
    .min(2, { message: 'L\'adresse doit contenir au moins 2 caractères' })
    .max(255, { message: 'L\'adresse ne doit pas dépasser 255 caractères' })
    .trim(),
});

/**
 * Validation schema for updating a fournisseur
 */
export const updateFournisseurSchema = z.object({
  nom: z
    .string()
    .min(2, { message: 'Le nom doit contenir au moins 2 caractères' })
    .max(100, { message: 'Le nom ne doit pas dépasser 100 caractères' })
    .optional(),
  telephone: z
    .string()
    .regex(/^[+]?[0-9\s\-()]{7,}$/, {
      message: 'Le numéro de téléphone n\'est pas valide',
    })
    .optional(),
  adresse: z
    .string()
    .min(2, { message: 'L\'adresse doit contenir au moins 2 caractères' })
    .max(255, { message: 'L\'adresse ne doit pas dépasser 255 caractères' })
    .optional(),
}).refine((data) => {
  // At least one field should be present
  return Object.keys(data).length > 0;
}, {
  message: 'Au moins un champ doit être fourni pour la mise à jour',
});

/**
 * Validation options for Zod
 */
export const validatorOptions = {
  abortEarly: false, // Collect all errors
  stripUnknown: true, // Remove unknown fields
};
