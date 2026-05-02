# 📋 Architecture Fournisseur - Documentation

## 🎯 Vue d'ensemble
Implémentation complète du CRUD pour l'entité **Fournisseur** avec architecture propre en couches (Clean Architecture).

## 🏗️ Architecture en Couches

```
src/
├── controllers/
│   └── fournisseur.controller.js     # Gère les requêtes HTTP
├── services/
│   ├── base.service.js               # Logique métier générique
│   └── fournisseur.service.js        # Logique métier spécifique
├── repositories/
│   ├── base.repository.js            # Accès données générique
│   └── fournisseur.repository.js     # Accès données spécifique
├── routes/
│   └── fournisseur.routes.js         # Définition des routes REST
├── validations/
│   └── fournisseur.validation.js     # Schémas Zod
├── middlewares/
│   └── validate.middleware.js        # Middleware de validation
└── exceptions/
    └── http-error.exception.js       # Classes d'erreurs HTTP
```

## 📦 Dépendances Utilisées
- **Express.js** - Framework web
- **Prisma ORM** - ORM PostgreSQL
- **Zod** - Validation de schémas
- **express-validator** - Middleware de validation (utilisé dans routes)

## 🔧 Modèle Fournisseur
```prisma
model Fournisseur {
  id          String   @id @default(uuid())
  nom         String
  telephone   String
  adresse     String
  approvisionnements Approvisionnement[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🎯 Endpoints API

### POST /api/fournisseurs
Créer un nouveau fournisseur
- **Body requis**: nom (min 2), telephone (format valide), adresse (min 2)
- **Réponse**: 201 Created
- **Validation**: Doublon sur téléphone détecté (409 Conflict)

### GET /api/fournisseurs
Récupérer tous les fournisseurs
- **Réponse**: 200 OK

### GET /api/fournisseurs/:id
Récupérer un fournisseur par ID
- **Param**: id (UUID)
- **Réponse**: 200 OK ou 404 Not Found

### PUT /api/fournisseurs/:id
Mettre à jour un fournisseur
- **Param**: id (UUID)
- **Body**: nom, telephone, adresse (optionnels)
- **Réponse**: 200 OK

### DELETE /api/fournisseurs/:id
Supprimer un fournisseur
- **Param**: id (UUID)
- **Réponse**: 200 OK

## 🛡️ Gestion des Erreurs

### Middleware error-handler
- Format JSON uniforme
- Détection des erreurs Prisma (P2002, P2025)
- Messages personnalisés
- Stack trace en développement

### HttpError Exception
- Statuts HTTP standardisés
- Méthodes utilitaires (badRequest, notFound, conflict, etc.)

## 📝 Réponses API Standard
```json
{
  "success": true,
  "message": "...",
  "data": {...}
}
```

```json
{
  "success": false,
  "message": "...",
  "details": [...]
}
```

## ✅ Fonctionnalités Avancées

1. **BaseRepository** - CRUD générique avec Prisma
   - create, findAll, findById, findOne
   - update, delete, count, exists

2. **BaseService** - Logique métier générique
   - findById avec vérification 404
   - update avec vérification préalable
   - delete avec vérification préalable

3. **FournisseurRepository** - Extensions spécifiques
   - findByTelephone
   - findWithApprovisionnements
   - findByIdWithRelations

4. **FournisseurService** - Logique métier Fournisseur
   - Détection doublon téléphone
   - Protection mise à jour doublon

5. **FournisseurController** - Gestion HTTP
   - Try/catch avec next(err)
   - Réponses formatées

6. **Swagger JSDoc** - Documentation complète
   - Tags et descriptions
   - Schemas request/response
   - Codes d'erreur détaillés

## 🧪 Tests Réalisés
✅ Création valide
✅ Récupération (tous et par ID)
✅ Mise à jour
✅ Détection doublon téléphone
✅ Suppression
✅ Vérification suppression
✅ Validation longueur nom
✅ Validation format téléphone
✅ Relations approvisionnements

## 🚀 Démarrage
```bash
# Démarrer le serveur
npm start

# Mode développement
npm run dev

# Migrations Prisma
npm run prisma:migrate
```

## 🌐 URL Base
http://localhost:5000/api/fournisseurs

## 📄 Documentation
http://localhost:5000/api-docs (Swagger)
