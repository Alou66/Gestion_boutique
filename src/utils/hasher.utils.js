/**
 * Utilitaires de hachage de mot de passe
 * Utilise bcryptjs pour hasher et comparer les mots de passe
 */

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash un mot de passe en clair
 * @param {string} password - Mot de passe en clair
 * @returns {Promise<string>} Mot de passe hashé
 */
export const hashPassword = async (password) => {
  if (!password || typeof password !== 'string') {
    throw new Error('Le mot de passe doit être une chaîne de caractères non vide');
  }
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare un mot de passe en clair avec un hash
 * @param {string} plainPassword - Mot de passe en clair
 * @param {string} hashedPassword - Mot de passe hashé
 * @returns {Promise<boolean>} true si les mots de passe correspondent
 */
export const comparePassword = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword) {
    return false;
  }
  return bcrypt.compare(plainPassword, hashedPassword);
};
