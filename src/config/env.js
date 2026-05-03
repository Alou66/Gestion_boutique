/**
 * Configuration des variables d'environnement
 */

import { config } from 'dotenv';

config();

const { DATABASE_URL, JWT_SECRET } = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

export { DATABASE_URL, JWT_SECRET };
