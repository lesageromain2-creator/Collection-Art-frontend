// ============================================
// HOOK AUTHENTIFICATION
// ============================================

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '@/lib/axios';
import { supabase } from '@/lib/supabase';
import type { 
  AuthState, 
  LoginCredentials, 
  RegisterData, 
  UserAuth 
} from '@/types';
import { toast } from 'react-toastify';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: UserAuth) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Charger l'utilisateur au montage
  useEffect(() => {
    const loadUser = () => {
      try {
        // Compatibilité avec api.js qui utilise 'authToken'
        const token = localStorage.getItem('authToken') || localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
          const user = JSON.parse(userStr);
          setState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else if (token) {
          // Token présent mais pas de user stocké - considérer comme authentifié
          setState({
            user: null,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Erreur chargement utilisateur:', error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    loadUser();

    // Écouter les changements de session Supabase (seulement si configuré)
    let subscription: { unsubscribe: () => void } | null = null;
    
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_OUT') {
            setState({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
            localStorage.removeItem('authToken');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
          }
        }
      );
      subscription = data.subscription;
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const response = await axiosInstance.post('/auth/login', credentials);

      if (response.data.success) {
        const { token, user } = response.data;

        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));

        setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        toast.success('Connexion réussie !');
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Erreur login:', error);
      toast.error(error.response?.data?.message || 'Erreur de connexion');
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [router]);

  const register = useCallback(async (data: RegisterData) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const response = await axiosInstance.post('/auth/register', data);

      if (response.data.success) {
        toast.success('Inscription réussie ! Vérifiez votre email.');
        router.push('/login');
      }
    } catch (error: any) {
      console.error('Erreur inscription:', error);
      toast.error(error.response?.data?.message || 'Erreur d\'inscription');
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Erreur logout:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');

      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });

      toast.info('Déconnexion réussie');
      router.push('/');
    }
  }, [router]);

  const updateUser = useCallback((user: UserAuth) => {
    localStorage.setItem('user', JSON.stringify(user));
    setState((prev) => ({ ...prev, user }));
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
    updateUser,
  };
};

// Provider à utiliser dans _app.tsx
export { AuthContext };
