# Système d'Authentification JWT - Documentation

## 🔐 Architecture

Le système d'authentification est construit selon une architecture propre et scalable avec les couches suivantes :

- **Controllers** : Gèrent les requêtes HTTP
- **Services** : Contiennent la logique métier
- **Repositories** : Accès aux données via Prisma
- **Validations** : Validation des entrées avec Zod
- **Middlewares** : Protection des routes et gestion des erreurs
- **Utils** : Fonctions utilitaires (hash, JWT, réponses)
- **Config** : Configuration JWT

## 📋 Endpoints Disponibles

### 1. Inscription Administrateur

**POST** `/api/auth/register`

Crée un nouvel administrateur.

#### Request Body
```json
{
  "email": "admin@example.com",
  "password": "motdepasse123",
  "confirmPassword": "motdepasse123"
}
```

#### Réponse Succès (201)
```json
{
  "success": true,
  "message": "Administrateur créé avec succès",
  "data": {
    "id": "uuid",
    "email": "admin@example.com",
    "role": "ADMIN",
    "createdAt": "2026-05-02T22:00:00.000Z",
    "updatedAt": "2026-05-02T22:00:00.000Z"
  }
}
```

#### Erreurs Possibles
- **400** : Validation échouée (email invalide, mot de passe trop court)
- **409** : Un compte avec cet email existe déjà

---

### 2. Connexion Administrateur

**POST** `/api/auth/login`

Authentifie un administrateur et retourne un token JWT.

#### Request Body
```json
{
  "email": "admin@example.com",
  "password": "motdepasse123"
}
```

#### Réponse Succès (200)
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "admin@example.com",
      "role": "ADMIN",
      "createdAt": "2026-05-02T22:00:00.000Z",
      "updatedAt": "2026-05-02T22:00:00.000Z"
    }
  }
}
```

#### Erreurs Possibles
- **400** : Validation échouée
- **401** : Email ou mot de passe incorrect

---

### 3. Profil Utilisateur (Protégé)

**GET** `/api/auth/profile`

Récupère les informations du profil de l'utilisateur connecté.

#### Headers Requis
```
Authorization: Bearer <token>
```

#### Réponse Succès (200)
```json
{
  "success": true,
  "message": "Profil utilisateur",
  "data": {
    "id": "uuid",
    "email": "admin@example.com",
    "role": "ADMIN",
    "createdAt": "2026-05-02T22:00:00.000Z",
    "updatedAt": "2026-05-02T22:00:00.000Z"
  }
}
```

#### Erreurs Possibles
- **401** : Token manquant ou invalide
- **404** : Utilisateur non trouvé

---

## 🔒 Sécurité

### Protection des Routes

Toutes les routes privées sont protégées par le middleware `authenticate` qui vérifie :
1. La présence du token dans l'en-tête `Authorization`
2. Le format `Bearer <token>`
3. La validité et l'expiration du token JWT

### Validation des Entrées

Utilisation de **Zod** pour une validation stricte :
- Email valide requis
- Mot de passe minimum 6 caractères
- Confirmation du mot de passe (pour l'inscription)
- Aucun champ vide autorisé

### Stockage des Mots de Passe

- Hachage avec **bcryptjs** (10 rounds)
- Comparaison sécurisée lors de la connexion
- Le mot de passe n'est **jamais** retourné dans les réponses API

### Tokens JWT

- **Secret** : Défini via `process.env.JWT_SECRET`
- **Expiration** : 1 jour
- **Payload** : id, email, role
- **Génération** : via `jsonwebtoken`

## 📦 Structure des Fichiers

```
src/
├── config/
│   └── jwt.js              # Configuration JWT
├── controllers/
│   └── auth.controller.js   # Logique des requêtes HTTP
├── middlewares/
│   ├── auth.middleware.js   # Protection des routes
│   └── validate.middleware.js # Validation Zod
├── repositories/
│   └── auth.repository.js   # Accès Prisma
├── services/
│   └── auth.service.js      # Logique métier
├── utils/
│   ├── hasher.utils.js      # Hachage bcrypt
│   ├── http-error.utils.js  # Erreurs HTTP personnalisées
│   └── response.utils.js    # Format de réponse standard
├── validations/
│   └── auth.validation.js   # Schémas Zod
└── routes/
    └── auth.routes.js       # Définition des routes
```

## 🚀 Utilisation

### Démarrer le serveur

```bash
npm run dev
```

### Tester avec cURL

#### Inscription
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"secret123","confirmPassword":"secret123"}'
```

#### Connexion
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"secret123"}'
```

#### Profil (avec token)
```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <votre_token>"
```

## ✨ Qualité du Code

- Architecture propre et scalable
- Séparation des responsabilités (MVC-like)
- Gestion des erreurs centralisée
- Réponses standardisées
- Code prêt pour production
- Conforme aux exigences L3

## 🔧 Configuration

### Variables d'environnement requises

```env
JWT_SECRET=your-super-secret-key
DATABASE_URL=postgresql://...
```
