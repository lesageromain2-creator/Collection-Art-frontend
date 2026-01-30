// hooks/useProjectFiles.js
import { useState, useEffect, useCallback } from 'react';
import {
  getProjectFiles,
  getProjectFileDownload,
  deleteProjectFileByProject,
  deleteProjectFile,
} from '../utils/api';

export function useProjectFiles(projectId, { useAdminDelete = false } = {}) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFiles = useCallback(async () => {
    if (!projectId) {
      setFiles([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await getProjectFiles(projectId);
      setFiles(data.files || data || []);
    } catch (err) {
      setError(err.message || 'Erreur chargement des fichiers');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const downloadFile = async (fileId) => {
    try {
      const url = await getProjectFileDownload(projectId, fileId);
      if (url) window.open(url, '_blank');
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const deleteFile = async (fileId) => {
    try {
      if (useAdminDelete) {
        await deleteProjectFile(fileId);
      } else {
        await deleteProjectFileByProject(projectId, fileId);
      }
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch (err) {
      console.error('Delete failed:', err);
      throw err;
    }
  };

  return {
    files,
    loading,
    error,
    refreshFiles: fetchFiles,
    downloadFile,
    deleteFile,
  };
}
