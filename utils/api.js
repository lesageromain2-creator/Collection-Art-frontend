// frontend/utils/api.js - VERSION JWT

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ============================================
// GESTION DU TOKEN JWT
// ============================================

const TOKEN_KEY = 'auth_token';

const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
};

const removeToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
};

// ============================================
// FONCTION FETCH API
// ============================================

const fetchAPI = async (endpoint, options = {}) => {
  const token = getToken();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Ajouter le token si disponible
  if (token) {
    defaultOptions.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    const data = await response.json();

    // Si le token est expiré, déconnecter
    if (response.status === 401 && data.error?.includes('Token')) {
      removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    if (!response.ok) {
      throw new Error(data.error || 'Une erreur est survenue');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============================================
// AUTH API - VERSION JWT
// ============================================

export const login = async (credentials) => {
  const data = await fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  
  // Sauvegarder le token
  if (data.token) {
    setToken(data.token);
  }
  
  return data;
};

export const register = async (userData) => {
  const data = await fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  
  // Sauvegarder le token
  if (data.token) {
    setToken(data.token);
  }
  
  return data;
};

export const logout = async () => {
  try {
    await fetchAPI('/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Erreur logout:', error);
  } finally {
    // Toujours supprimer le token
    removeToken();
  }
};

export const checkAuth = async () => {
  const token = getToken();
  
  if (!token) {
    return { 
      authenticated: false,
      user: null 
    };
  }
  
  try {
    const response = await fetchAPI('/auth/me');
    return {
      authenticated: true,
      user: response.user
    };
  } catch (error) {
    removeToken();
    return { 
      authenticated: false,
      user: null 
    };
  }
};

export const refreshToken = async () => {
  try {
    const data = await fetchAPI('/auth/refresh', {
      method: 'POST',
    });
    
    if (data.token) {
      setToken(data.token);
    }
    
    return data;
  } catch (error) {
    removeToken();
    throw error;
  }
};

// ============================================
// USERS API
// ============================================

export const updateUserProfile = async (userData) => {
  return fetchAPI('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

export const changePassword = async (passwordData) => {
  return fetchAPI('/users/change-password', {
    method: 'PUT',
    body: JSON.stringify(passwordData),
  });
};

export const deleteAccount = async () => {
  return fetchAPI('/users/profile', {
    method: 'DELETE',
  });
};

export const getUserProfile = async () => {
  return fetchAPI('/users/profile');
};

export const updateProfile = async (userData) => {
  return fetchAPI('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

export const getUserStats = async () => {
  return fetchAPI('/users/stats');
};

// ============================================
// SETTINGS API
// ============================================

export const fetchSettings = async () => {
  return fetchAPI('/settings');
};

export const fetchSetting = async (key) => {
  return fetchAPI(`/settings/${key}`);
};

export const updateSetting = async (key, value) => {
  return fetchAPI(`/settings/${key}`, {
    method: 'PUT',
    body: JSON.stringify({ value }),
  });
};

export const createSetting = async (key, value, type, description) => {
  return fetchAPI('/settings', {
    method: 'POST',
    body: JSON.stringify({ key, value, type, description }),
  });
};

export const deleteSetting = async (key) => {
  return fetchAPI(`/settings/${key}`, {
    method: 'DELETE',
  });
};

// ============================================
// DISHES API
// ============================================

export const fetchDishes = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return fetchAPI(`/dishes${queryString ? `?${queryString}` : ''}`);
};

export const fetchDishById = async (id) => {
  return fetchAPI(`/dishes/${id}`);
};

export const searchDishes = async (query) => {
  return fetchAPI(`/dishes/search?q=${encodeURIComponent(query)}`);
};

// ============================================
// CATEGORIES API
// ============================================

export const fetchCategories = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return fetchAPI(`/categories${queryString ? `?${queryString}` : ''}`);
};

export const fetchCategoryById = async (id) => {
  return fetchAPI(`/categories/${id}`);
};

export const fetchDishesByCategory = async (categoryId) => {
  return fetchAPI(`/categories/${categoryId}/dishes`);
};

// ============================================
// MENUS API
// ============================================

export async function fetchMenus() {
  return fetchAPI('/menus');
}

export async function fetchMenuById(id) {
  const response = await fetchAPI(`/menus/${id}`);
  return response.menu;
}

export async function fetchMenusByType(type) {
  return fetchAPI(`/menus/type/${type}`);
}

export async function createMenu(menuData) {
  return fetchAPI('/menus', {
    method: 'POST',
    body: JSON.stringify(menuData),
  });
}

export async function updateMenu(id, menuData) {
  return fetchAPI(`/menus/${id}`, {
    method: 'PUT',
    body: JSON.stringify(menuData),
  });
}

export async function deleteMenu(id) {
  return fetchAPI(`/menus/${id}`, {
    method: 'DELETE',
  });
}

// ============================================
// RESERVATIONS API
// ============================================

export const createReservation = async (reservationData) => {
  try {
    console.log('📝 Création réservation avec:', reservationData);
    
    const data = await fetchAPI('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
    
    console.log('✅ Réservation créée:', data);
    return data;
  } catch (error) {
    console.error('❌ Erreur création réservation:', error);
    throw error;
  }
};

export const getMyReservations = async () => {
  try {
    const data = await fetchAPI('/reservations/my');
    return data.reservations || [];
  } catch (error) {
    console.error('Erreur getMyReservations:', error);
    throw error;
  }
};

export const getReservationById = async (id) => {
  try {
    const data = await fetchAPI(`/reservations/${id}`);
    return data.reservation;
  } catch (error) {
    console.error('Erreur getReservationById:', error);
    throw error;
  }
};

export const cancelReservation = async (id) => {
  try {
    const data = await fetchAPI(`/reservations/${id}/cancel`, {
      method: 'PUT',
    });
    return data;
  } catch (error) {
    console.error('Erreur cancelReservation:', error);
    throw error;
  }
};

export const checkAvailability = async (reservationData) => {
  try {
    const data = await fetchAPI('/reservations/check-availability', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
    return data;
  } catch (error) {
    console.error('Erreur checkAvailability:', error);
    throw error;
  }
};

export const fetchUserReservations = async () => {
  return fetchAPI('/reservations/my');
};

export const fetchReservationById = async (id) => {
  return fetchAPI(`/reservations/${id}`);
};

export const updateReservation = async (id, reservationData) => {
  return fetchAPI(`/reservations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(reservationData),
  });
};

export const deleteReservation = async (id) => {
  return fetchAPI(`/reservations/${id}`, {
    method: 'DELETE',
  });
};

// ============================================
// FAVORITES API
// ============================================

export const fetchFavorites = async () => {
  const response = await fetchAPI('/favorites');
  return response;
};

export const addFavorite = async (dishId) => {
  return fetchAPI('/favorites', {
    method: 'POST',
    body: JSON.stringify({ dishId }),
  });
};

export const removeFavorite = async (dishId) => {
  return fetchAPI(`/favorites/${dishId}`, {
    method: 'DELETE',
  });
};

export const checkIsFavorite = async (dishId) => {
  const response = await fetchAPI(`/favorites/check/${dishId}`);
  return response.isFavorite;
};

export const getFavoritesCount = async () => {
  const response = await fetchAPI('/favorites/count');
  return response.count;
};

// ============================================
// REVIEWS API
// ============================================

export const createReview = async (dishId, reviewData) => {
  return fetchAPI('/reviews', {
    method: 'POST',
    body: JSON.stringify({ dishId, ...reviewData }),
  });
};

export const fetchUserReviews = async () => {
  return fetchAPI('/reviews/my');
};

export const fetchDishReviews = async (dishId) => {
  return fetchAPI(`/reviews/dish/${dishId}`);
};

export const updateReview = async (reviewId, reviewData) => {
  return fetchAPI(`/reviews/${reviewId}`, {
    method: 'PUT',
    body: JSON.stringify(reviewData),
  });
};

export const deleteReview = async (reviewId) => {
  return fetchAPI(`/reviews/${reviewId}`, {
    method: 'DELETE',
  });
};

// ============================================
// LOYALTY POINTS API
// ============================================

export const getLoyaltyPoints = async () => {
  return fetchAPI('/loyalty/points');
};

export const getLoyaltyHistory = async () => {
  return fetchAPI('/loyalty/history');
};

export const redeemPoints = async (rewardId) => {
  return fetchAPI('/loyalty/redeem', {
    method: 'POST',
    body: JSON.stringify({ rewardId }),
  });
};

// ============================================
// CONTACT API
// ============================================

export const sendContactMessage = async (messageData) => {
  return fetchAPI('/contact', {
    method: 'POST',
    body: JSON.stringify(messageData),
  });
};