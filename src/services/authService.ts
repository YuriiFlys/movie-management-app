import axios from 'axios';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth';

const API_URL = import.meta.env.VITE_API_URL

const authAPI = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authService = {
    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await authAPI.post('/users', data);
        return response.data;
    },

    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await authAPI.post('/sessions', data);
        return response.data;
    },

    async logout(): Promise<void> {
        return Promise.resolve();
    },
};