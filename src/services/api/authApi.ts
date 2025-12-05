import apiClient from './apiClient';
import { User, AuthCredentials } from '../../types/api';

/**
 * Authentication API Service
 */

export const authApi = {
  login: async (credentials: AuthCredentials): Promise<User> => {
    const response = await apiClient.post<User>('/auth/login', credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  refreshToken: async (token: string): Promise<{ token: string }> => {
    const response = await apiClient.post<{ token: string }>('/auth/refresh', { token });
    return response.data;
  },
};
