/**
 * Test d'intégration de l'authentification
 * Vérifie que tous les composants sont correctement importés
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');

// Tests d'importation des modules
describe('Système d\'authentification', () => {
  it('devrait importer le module JWT correctement', async () => {
    const { generateToken, verifyToken } = await import(path.join(rootDir, 'src/config/jwt.js'));
    assert.ok(generateToken, 'generateToken devrait être défini');
    assert.ok(verifyToken, 'verifyToken devrait être défini');
    assert.strictEqual(typeof generateToken, 'function');
    assert.strictEqual(typeof verifyToken, 'function');
  });

  it('devrait importer les utilitaires de hachage correctement', async () => {
    const { hashPassword, comparePassword } = await import(path.join(rootDir, 'src/utils/hasher.utils.js'));
    assert.ok(hashPassword, 'hashPassword devrait être défini');
    assert.ok(comparePassword, 'comparePassword devrait être défini');
    assert.strictEqual(typeof hashPassword, 'function');
    assert.strictEqual(typeof comparePassword, 'function');
  });

  it('devrait importer les validations correctement', async () => {
    const { registerAdminSchema, loginSchema } = await import(path.join(rootDir, 'src/validations/auth.validation.js'));
    assert.ok(registerAdminSchema, 'registerAdminSchema devrait être défini');
    assert.ok(loginSchema, 'loginSchema devrait être défini');
  });

  it('devrait importer le middleware d\'authentification correctement', async () => {
    const { authenticate } = await import(path.join(rootDir, 'src/middlewares/auth.middleware.js'));
    assert.ok(authenticate, 'authenticate devrait être défini');
    assert.strictEqual(typeof authenticate, 'function');
  });

  it('devrait importer le middleware de validation correctement', async () => {
    const { validate } = await import(path.join(rootDir, 'src/middlewares/validate.middleware.js'));
    assert.ok(validate, 'validate devrait être défini');
    assert.strictEqual(typeof validate, 'function');
  });

  it('devrait importer les utilitaires de réponse correctement', async () => {
    const { success, created } = await import(path.join(rootDir, 'src/utils/response.utils.js'));
    assert.ok(success, 'success devrait être défini');
    assert.ok(created, 'created devrait être défini');
    assert.strictEqual(typeof success, 'function');
    assert.strictEqual(typeof created, 'function');
  });

  it('devrait importer les erreurs HTTP correctement', async () => {
    const { HttpError } = await import(path.join(rootDir, 'src/utils/http-error.utils.js'));
    assert.ok(HttpError, 'HttpError devrait être défini');
    assert.strictEqual(typeof HttpError, 'function');
  });
});

console.log('✅ Tous les tests d\'importation sont prêts !');
