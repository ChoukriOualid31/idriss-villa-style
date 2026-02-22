import axios, { AxiosError, AxiosInstance } from 'axios';
import Cookies from 'js-cookie';
import { SiteContent } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || '';
      const publicReadEndpoints = [
        '/properties',
        '/properties/featured',
        '/properties/filters/cities',
        '/site-content/public',
      ];

      const isPublicRead = publicReadEndpoints.some((endpoint) => requestUrl.startsWith(endpoint));
      const isAuthCheck = requestUrl.startsWith('/auth/me');

      // Always clear invalid token
      Cookies.remove('token');

      // Do not force redirect for public endpoints or initial auth check
      if (typeof window !== 'undefined' && !isPublicRead && !isAuthCheck) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  
  logout: () => api.post('/auth/logout'),
  
  getMe: () => api.get('/auth/me'),
  
  updateProfile: (data: { name?: string; email?: string }) =>
    api.patch('/auth/update-profile', data),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    api.patch('/auth/change-password', { currentPassword, newPassword }),
};

// Properties API
export const propertyApi = {
  getAll: (params?: Record<string, any>) =>
    api.get('/properties', { params }),
  
  getFeatured: (limit?: number) =>
    api.get('/properties/featured', { params: { limit } }),
  
  getById: (id: string) =>
    api.get(`/properties/${id}`),
  
  create: (data: any) =>
    api.post('/properties', data),
  
  update: (id: string, data: any) =>
    api.patch(`/properties/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/properties/${id}`),
  
  getStats: () =>
    api.get('/properties/stats/overview'),
  
  getCities: () =>
    api.get('/properties/filters/cities'),
};

// Users API (Admin only)
export const userApi = {
  getAll: (params?: Record<string, any>) =>
    api.get('/users', { params }),
  
  getById: (id: string) =>
    api.get(`/users/${id}`),
  
  updateRole: (id: string, role: string) =>
    api.patch(`/users/${id}/role`, { role }),
  
  delete: (id: string) =>
    api.delete(`/users/${id}`),
  
  getDashboardStats: () =>
    api.get('/users/stats/dashboard'),
};

// Upload API
export const uploadApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  uploadImages: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deleteImage: (filename: string) =>
    api.delete(`/upload/image/${filename}`),
};

export const siteContentApi = {
  getPublic: () => api.get<{ status: string; data: { content: SiteContent } }>('/site-content/public'),
  updateAdmin: (data: Partial<SiteContent>) => api.patch('/site-content/admin', data),
};

export default api;
