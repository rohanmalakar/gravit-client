// src/api/apiClient.ts
import axios from 'axios';
import type { AxiosInstance } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
});

// Attach admin key for admin routes when present
export function adminApi(): AxiosInstance {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000
  });
  
  const adminKey = import.meta.env.VITE_ADMIN_KEY || localStorage.getItem('ADMIN_API_KEY');
  if (adminKey) {
    instance.defaults.headers.common['x-api-key'] = adminKey;
  }
  
  return instance;
}

api.interceptors.response.use(
  res => res,
  err => {
    const data = err.response?.data;
    const message = data?.message || data?.error || err.message;
    return Promise.reject({ 
      message, 
      status: err.response?.status || 500, 
      raw: err 
    });
  }
);

export default api;
