import { User } from './auth';
import { Movie, MovieFilters, SortOptions } from './movie';

export interface RootState {
    auth: AuthState;
    movies: MoviesState;
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

export interface MoviesState {
    movies: Movie[];
    loading: boolean;
    error: string | null;
    selectedMovie: Movie | null;
    filters: MovieFilters;
    sortOptions: SortOptions;
    searchResults: Movie[];
    isSearching: boolean;
  }

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}