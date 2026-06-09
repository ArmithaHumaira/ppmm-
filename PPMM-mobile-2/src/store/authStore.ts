import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import api, { registerLogoutCallback } from '../api/axios';
import { User, AuthResponse } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Register logout callback to handle API 401 unauthorized errors
  registerLogoutCallback(() => {
    get().logout();
  });

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    clearError: () => set({ error: null }),

    checkAuth: async () => {
      set({ isLoading: true, error: null });
      try {
        const token = await SecureStore.getItemAsync('user_token');
        const userStr = await SecureStore.getItemAsync('user_data');
        
        if (token && userStr) {
          const user = JSON.parse(userStr) as User;
          
          // Verify token with backend
          try {
            const response = await api.get<{ user: User }>('/auth/me');
            const updatedUser = response.data.user;
            await SecureStore.setItemAsync('user_data', JSON.stringify(updatedUser));
            set({ user: updatedUser, token, isAuthenticated: true });
          } catch (e) {
            console.warn('Failed to verify token with backend. Using cached user data.', e);
            // If offline, keep using cached session. If definitely unauthorized (handled by interceptor), it will logout.
            set({ user, token, isAuthenticated: true });
          }
        } else {
          set({ user: null, token: null, isAuthenticated: false });
        }
      } catch (err: any) {
        console.error('Error checking auth:', err);
        set({ user: null, token: null, isAuthenticated: false });
      } finally {
        set({ isLoading: false });
      }
    },

    login: async (emailOrUsername, password) => {
      set({ isLoading: true, error: null });
      try {
        // Backend login endpoint can accept email or username
        const response = await api.post<AuthResponse>('/auth/login', {
          email: emailOrUsername, // Backend might expect email or username
          password,
        });

        const { token, user } = response.data;

        await SecureStore.setItemAsync('user_token', token);
        await SecureStore.setItemAsync('user_data', JSON.stringify(user));

        set({ user, token, isAuthenticated: true, error: null });
        return true;
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Login gagal. Silakan periksa kembali email/password Anda.';
        set({ error: errorMsg });
        return false;
      } finally {
        set({ isLoading: false });
      }
    },

    register: async (username, email, password) => {
      set({ isLoading: true, error: null });
      try {
        await api.post('/auth/register', {
          username,
          email,
          password,
        });

        // Some backends return token on register, others require logging in.
        // We will assume the user has to login, or we can automatically attempt login.
        set({ error: null });
        return true;
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Pendaftaran gagal. Silakan coba lagi.';
        set({ error: errorMsg });
        return false;
      } finally {
        set({ isLoading: false });
      }
    },

    logout: async () => {
      set({ isLoading: true });
      try {
        // Optional: notify backend about logout
        try {
          await api.post('/auth/logout');
        } catch (e) {
          // Ignore network errors on logout
        }
        
        await SecureStore.deleteItemAsync('user_token');
        await SecureStore.deleteItemAsync('user_data');
        
        set({ user: null, token: null, isAuthenticated: false, error: null });
      } catch (err) {
        console.error('Error during logout:', err);
        // Fallback clear state
        set({ user: null, token: null, isAuthenticated: false });
      } finally {
        set({ isLoading: false });
      }
    },
  };
});
