export interface User {
    id: number;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    token: string;
    status: number;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
}

export interface AuthError {
    status: number;
    error: {
        fields: Record<string, string>;
        code: string;
    };
}