import { RootState } from '@/types';

export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export const selectMovies = (state: RootState) => state.movies.movies;
export const selectMoviesLoading = (state: RootState) => state.movies.moviesLoading;
export const selectMoviesError = (state: RootState) => state.movies.moviesError;
export const selectTotalMovies = (state: RootState) => state.movies.totalMovies;
export const selectCurrentQuery = (state: RootState) => state.movies.currentQuery;

export const selectSelectedMovie = (state: RootState) => state.movies.selectedMovie;
export const selectSelectedMovieLoading = (state: RootState) => state.movies.selectedMovieLoading;
export const selectSelectedMovieError = (state: RootState) => state.movies.selectedMovieError;

export const selectCreateMovieLoading = (state: RootState) => state.movies.createMovieLoading;
export const selectUpdateMovieLoading = (state: RootState) => state.movies.updateMovieLoading;
export const selectDeleteMovieLoading = (state: RootState) => state.movies.deleteMovieLoading;

export const selectIsInitialized = (state: RootState) => state.movies.isInitialized;

export const selectIsImporting = (state: RootState) => state.movies.isImporting;
export const selectImportProgress = (state: RootState) => state.movies.importProgress;

export const selectIsSearchActive = (state: RootState) => {
  const query = state.movies.currentQuery;
  return !!(query.actor || query.title || query.search);
};
