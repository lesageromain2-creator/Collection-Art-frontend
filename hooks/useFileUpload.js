// hooks/useFileUpload.js
import { useState } from 'react';
import { uploadProjectFiles } from '../utils/api';

const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'Fichier trop volumineux (max 50MB)',
  INVALID_TYPE: 'Type de fichier non autorisé',
  UPLOAD_FAILED: "Échec de l'upload. Réessayez.",
  NETWORK_ERROR: 'Erreur réseau. Vérifiez votre connexion.',
  UNAUTHORIZED: "Vous n'avez pas les permissions nécessaires.",
};

export function useFileUpload(projectId) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadFiles = async (files) => {
    if (!projectId) {
      setError(ERROR_MESSAGES.UNAUTHORIZED);
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
    }
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const data = await uploadProjectFiles(projectId, files, {
        onProgress: (p) => setProgress(p),
      });
      setUploading(false);
      setProgress(100);
      return data;
    } catch (err) {
      const msg =
        err.message?.includes('réseau') || err.message?.includes('network')
          ? ERROR_MESSAGES.NETWORK_ERROR
          : err.message?.includes('401')
            ? ERROR_MESSAGES.UNAUTHORIZED
            : ERROR_MESSAGES.UPLOAD_FAILED;
      setError(msg);
      setUploading(false);
      throw err;
    }
  };

  return { uploadFiles, uploading, progress, error };
}
