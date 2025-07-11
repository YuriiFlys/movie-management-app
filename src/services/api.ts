import axios from 'axios';

const getApiUrl = (): string => {
    if (typeof window !== 'undefined' && (window as any).ENV?.VITE_API_URL) {
        return (window as any).ENV.VITE_API_URL;
    }
    
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    
    return 'http://localhost';
};

const API_URL = getApiUrl();

console.log('🔧 API Configuration:', {
    apiUrl: API_URL,
    source: typeof window !== 'undefined' && (window as any).ENV?.VITE_API_URL 
        ? 'runtime (Docker)' 
        : 'build-time'
});

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);