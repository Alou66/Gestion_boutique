/**
 * Middleware de téléchargement d'images avec Multer
 * Gère l'upload de fichiers pour les produits
 */

import multer from 'multer';
import { uploadToCloudinary, extractPublicIdFromUrl } from '../config/cloudinary.js';
import { HttpError } from '../exceptions/http-error.exception.js';

// Configuration mémoire pour Multer (stockage en RAM)
const storage = multer.memoryStorage();

// Filtre les types de fichiers acceptés
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new HttpError(
        'Format de fichier non supporté. Formats acceptés : JPG, JPEG, PNG',
        400
      ),
      false
    );
  }
};

// Configuration Multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 1, // 1 fichier max
  },
});

/**
 * Middleware d'upload d'image produit
 * À utiliser dans les routes pour l'upload d'images
 */
export const uploadProduitImage = upload.single('image');

/**
 * Middleware de validation du fichier uploadé
 * Vérifie qu'un fichier a bien été fourni
 */
export const validateImageUpload = (req, res, next) => {
  if (!req.file) {
    return next(new HttpError('Aucun fichier image fourni', 400));
  }
  next();
};

export { uploadToCloudinary, extractPublicIdFromUrl };
export default uploadProduitImage;
