// frontend/utils/api.js - Ajouter les fonctions pour les projets

// ... fonctions existantes ...

// ============================================
// Projets
// ============================================

export const createProject = async (projectData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/admin/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(projectData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur lors de la création du projet');
  }

  return response.json();
};

export const getProjects = async (params = {}) => {
  const token = localStorage.getItem('token');
  const queryString = new URLSearchParams(params).toString();
  
  const response = await fetch(`${API_URL}/admin/projects?${queryString}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des projets');
  }

  return response.json();
};

export const getProject = async (id) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/admin/projects/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération du projet');
  }

  return response.json();
};

// ============================================
// Utilisateurs/Clients
// ============================================

export const getUsers = async (role = null) => {
  const token = localStorage.getItem('token');
  const queryString = role ? `?role=${role}` : '';
  
  const response = await fetch(`${API_URL}/admin/users${queryString}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des utilisateurs');
  }

  return response.json();
};

export const getClients = async () => {
  return getUsers('client');
};
