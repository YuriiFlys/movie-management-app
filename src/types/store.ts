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
    moviesLoading: boolean;
    moviesError: string | null;
    selectedMovie: Movie | null;
    selectedMovieLoading: boolean;
    selectedMovieError: string | null;
    createMovieLoading: boolean;
    createMovieError: string | null;
    updateMovieLoading: boolean;
    updateMovieError: string | null;
    deleteMovieLoading: boolean;
    deleteMovieError: string | null;
    isInitialized: boolean
    filters: MovieFilters;
    sortOptions: SortOptions;
    isImporting: boolean;
    importProgress: {
      total: number;
      imported: number;
      failed: number;
    } | null;
    currentQuery: {
      sort?: 'id' | 'title' | 'year';
      order?: 'ASC' | 'DESC';
      limit?: number;
      offset?: number;
      actor?: string;
      title?: string;
      search?: string;
    };
    totalMovies: number;
  }

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}