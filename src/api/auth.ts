import api from './apiClient';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  };
}

export const authApi = {
  register: async (name: string, email: string, password: string, role: string = 'user') => {
    const response = await api.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
      role,
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },
};
