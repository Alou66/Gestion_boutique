import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

config();

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

/**
 * Prisma Client instance
 * Singleton pattern to prevent multiple instances
 */
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Handle connection errors
prisma.$connect()
  .then(() => {
    console.log('✅ Connected to PostgreSQL database');
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Database connection closed');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  console.log('Database connection closed');
  process.exit(0);
});

export default prisma;
