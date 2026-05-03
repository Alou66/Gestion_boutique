/**
 * Validation des données d'authentification avec Zod
 * Valide les entrées pour l'inscription et la connexion
 */

import { z } from 'zod';

/**
 * Schéma de validation pour l'inscription d'un administrateur
 */
export const registerAdminSchema = z.object({
  email: z
    .string({
      required_error: 'L\'email est obligatoire',
    })
    .trim()
    .min(1, 'L\'email ne peut pas être vide')
    .email('L\'email doit être valide'),
  password: z
    .string({
      required_error: 'Le mot de passe est obligatoire',
    })
    .trim()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z
    .string({
      required_error: 'La confirmation du mot de passe est obligatoire',
    })
    .trim()
    .min(1, 'La confirmation ne peut pas être vide'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

/**
 * Schéma de validation pour la connexion
 */
export const loginSchema = z.object({
  email: z
    .string({
      required_error: 'L\'email est obligatoire',
    })
    .trim()
    .min(1, 'L\'email ne peut pas être vide')
    .email('L\'email doit être valide'),
  password: z
    .string({
      required_error: 'Le mot de passe est obligatoire',
    })
    .trim()
    .min(1, 'Le mot de passe ne peut pas être vide')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});
