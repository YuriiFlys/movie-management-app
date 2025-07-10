import { RootState } from '@/types';

export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export const selectMovies = (state: RootState) => state.movies.movies;
export const selectMoviesLoading = (state: RootState) => state.movies.loading;
export const selectMoviesError = (state: RootState) => state.movies.error;
export const selectSelectedMovie = (state: RootState) => state.movies.selectedMovie;

export const selectIsModalOpen = (state: RootState) => state.ui.isModalOpen;
export const selectModalType = (state: RootState) => state.ui.modalType;
export const selectNotifications = (state: RootState) => state.ui.notifications;
export const selectIsImporting = (state: RootState) => state.ui.isImporting;