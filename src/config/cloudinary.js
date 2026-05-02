/**
 * Configuration Cloudinary
 * Gère l'upload et la suppression d'images Cloudinary
 */

import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';

config();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error('Variables Cloudinary manquantes dans le fichier .env');
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

/**
 * Upload une image vers Cloudinary
 * @param {Buffer} fileBuffer - Buffer de l'image
 * @param {string} folder - Dossier cible sur Cloudinary
 * @returns {Promise<{url: string, publicId: string}>} URL et public_id de l'image
 */
export const uploadToCloudinary = async (fileBuffer, folder = 'produits') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Erreur d'upload Cloudinary : ${error.message}`));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Supprime une image de Cloudinary
 * @param {string} publicId - Public ID de l'image
 * @returns {Promise<void>}
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) {
    return;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });

    if (result.result !== 'ok') {
      console.warn(`Cloudinary: La suppression de l'image ${publicId} a échoué : ${result.result}`);
    }
  } catch (error) {
    console.error(`Cloudinary: Erreur lors de la suppression de l'image ${publicId}:`, error.message);
    // On ne lance pas d'erreur pour ne pas bloquer la suppression du produit en base
  }
};

/**
 * Extrait le public_id depuis une URL Cloudinary
 * @param {string} url - URL Cloudinary
 * @returns {string|null} Public ID ou null si extraction impossible
 */
export const extractPublicIdFromUrl = (url) => {
  if (!url) {
    return null;
  }

  try {
    // Formate: https://res.cloudinary.com/{cloud_name}/image/upload/v{timestamp}/{public_id}.{format}
    const urlParts = url.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    if (uploadIndex === -1) {
      return null;
    }

    // Prend tout après 'upload' jusqu'à l'extension
    const pathAfterUpload = urlParts.slice(uploadIndex + 1).join('/');
    const withoutExtension = pathAfterUpload.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    const withoutVersion = withoutExtension.replace(/^v\d+\//, '');

    return withoutVersion;
  } catch {
    return null;
  }
};
