import { User } from './auth';

export interface RootState {
    auth: AuthState;
    ui: UiState;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export interface UiState {
    isModalOpen: boolean;
    modalType: 'add' | 'edit' | 'delete' | 'view' | 'login' | 'register' | null;
    notifications: Notification[];
    isImporting: boolean;
}

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}