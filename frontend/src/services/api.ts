import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { storage } from '@/lib/utils';
import type { ApiError, ApiResponse } from '@/types';

// API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Create axios instance
const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - attach auth token
api.interceptors.request.use(
    (config) => {
        const token = storage.get<string>('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiError>) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            // Get the request URL to check if it's an auth endpoint
            const requestUrl = error.config?.url || '';
            const isAuthEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');

            // Only redirect for non-auth endpoints (e.g., protected API calls)
            // For auth endpoints (login/register), let the error be handled by the form
            if (!isAuthEndpoint) {
                storage.remove('auth_token');
                storage.remove('user');

                // Only redirect if not already on login page
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
        }

        // Handle network errors
        if (!error.response) {
            return Promise.reject({
                message: 'Network error. Please check your connection.',
                statusCode: 0,
            });
        }

        // Pass through API errors
        return Promise.reject(error.response.data || {
            message: 'An unexpected error occurred',
            statusCode: error.response.status,
        });
    }
);

// Helper methods for common HTTP operations
export const apiClient = {
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await api.get<ApiResponse<T>>(url, config);
        return response.data.data;
    },

    async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await api.post<ApiResponse<T>>(url, data, config);
        return response.data.data;
    },

    async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await api.put<ApiResponse<T>>(url, data, config);
        return response.data.data;
    },

    async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await api.patch<ApiResponse<T>>(url, data, config);
        return response.data.data;
    },

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await api.delete<ApiResponse<T>>(url, config);
        return response.data.data;
    },

    // For file uploads
    async upload<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
        const response = await api.post<ApiResponse<T>>(url, formData, {
            ...config,
            headers: {
                ...config?.headers,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },
};

export default api;
