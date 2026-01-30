// ============================================
// HOOK GESTION PROJETS
// ============================================

import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/lib/axios';
import type { 
  ClientProject, 
  ProjectCreateData, 
  ProjectUpdateData,
  PaginatedResponse 
} from '@/types';
import { toast } from 'react-toastify';

interface UseProjectsOptions {
  autoFetch?: boolean;
  userId?: string;
}

export const useProjects = (options: UseProjectsOptions = {}) => {
  const { autoFetch = true, userId } = options;

  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Récupérer les projets
  const fetchProjects = useCallback(async (page = 1, limit = 10) => {
    try {
      setIsLoading(true);
      setError(null);

      const endpoint = userId 
        ? `/projects/user/${userId}` 
        : '/projects';

      const response = await axiosInstance.get<PaginatedResponse<ClientProject>>(
        endpoint,
        { params: { page, limit } }
      );

      setProjects(response.data.data);
      setPagination(response.data.pagination);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur de chargement des projets';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Créer un projet
  const createProject = useCallback(async (data: ProjectCreateData) => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.post<{ data: ClientProject }>(
        '/projects',
        data
      );

      setProjects((prev) => [response.data.data, ...prev]);
      toast.success('Projet créé avec succès !');
      
      return response.data.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur de création du projet';
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mettre à jour un projet
  const updateProject = useCallback(async (id: string, data: ProjectUpdateData) => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.put<{ data: ClientProject }>(
        `/projects/${id}`,
        data
      );

      setProjects((prev) =>
        prev.map((p) => (p.id === id ? response.data.data : p))
      );

      toast.success('Projet mis à jour !');
      return response.data.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur de mise à jour';
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Supprimer un projet
  const deleteProject = useCallback(async (id: string) => {
    try {
      setIsLoading(true);

      await axiosInstance.delete(`/projects/${id}`);

      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success('Projet supprimé');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur de suppression';
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchProjects();
    }
  }, [autoFetch, fetchProjects]);

  return {
    projects,
    isLoading,
    error,
    pagination,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
};

// Hook pour un seul projet
export const useProject = (projectId?: string) => {
  const [project, setProject] = useState<ClientProject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    if (!projectId) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await axiosInstance.get<{ data: ClientProject }>(
        `/projects/${projectId}`
      );

      setProject(response.data.data);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur de chargement';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return {
    project,
    isLoading,
    error,
    refetch: fetchProject,
  };
};
