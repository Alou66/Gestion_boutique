/**
 * Validation Produit - Schémas Zod
 * Valide les données des requêtes Produit
 */

import { z } from 'zod';

/**
 * Schéma de validation pour la création d'un produit
 */
export const createProduitSchema = z.object({
  libelle: z
    .string()
    .min(2, { message: 'Le libellé doit contenir au moins 2 caractères' })
    .max(255, { message: 'Le libellé ne doit pas dépasser 255 caractères' })
    .trim(),
  prixUnitaire: z
    .coerce
    .number({
      required_error: 'Le prix unitaire est obligatoire',
    })
    .positive({ message: 'Le prix unitaire doit être supérieur à 0' })
    .multipleOf(0.01, { message: 'Le prix doit avoir au maximum 2 décimales' }),
  quantiteStock: z
    .coerce
    .number({
      invalid_type_error: 'La quantité en stock doit être un nombre',
    })
    .int({ message: 'La quantité en stock doit être un entier' })
    .min(0, { message: 'La quantité en stock ne peut pas être négative' })
    .default(0),
  image: z.string().optional(),
});

/**
 * Schéma de validation pour la mise à jour d'un produit
 */
export const updateProduitSchema = z.object({
  libelle: z
    .string()
    .min(2, { message: 'Le libellé doit contenir au moins 2 caractères' })
    .max(255, { message: 'Le libellé ne doit pas dépasser 255 caractères' })
    .trim()
    .optional(),
  prixUnitaire: z
    .coerce
    .number({
      invalid_type_error: 'Le prix unitaire doit être un nombre',
    })
    .positive({ message: 'Le prix unitaire doit être supérieur à 0' })
    .multipleOf(0.01, { message: 'Le prix doit avoir au maximum 2 décimales' })
    .optional(),
  quantiteStock: z
    .coerce
    .number({
      invalid_type_error: 'La quantité en stock doit être un nombre',
    })
    .int({ message: 'La quantité en stock doit être un entier' })
    .min(0, { message: 'La quantité en stock ne peut pas être négative' })
    .optional(),
  image: z.string().optional(),
}).refine((data) => {
  // Au moins un champ doit être fourni
  return Object.keys(data).length > 0;
}, {
  message: 'Au moins un champ doit être fourni pour la mise à jour',
});

/**
 * Schéma de validation pour l'incrémentation du stock
 */
export const incrementStockSchema = z.object({
  quantite: z
    .coerce
    .number({
      invalid_type_error: 'La quantité doit être un nombre',
    })
    .int({ message: 'La quantité doit être un entier' })
    .positive({ message: 'La quantité doit être supérieure à 0' })
    .optional(),
});

/**
 * Schéma de validation pour la décrémentation du stock
 */
export const decrementStockSchema = z.object({
  quantite: z
    .coerce
    .number({
      invalid_type_error: 'La quantité doit être un nombre',
    })
    .int({ message: 'La quantité doit être un entier' })
    .positive({ message: 'La quantité doit être supérieure à 0' })
    .optional(),
});

/**
 * Options de validation Zod
 */
export const validatorOptions = {
  abortEarly: false, // Collecte toutes les erreurs
  stripUnknown: true, // Supprime les champs inconnus
};