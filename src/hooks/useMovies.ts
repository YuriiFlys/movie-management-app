import { useCallback } from 'react';
import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import {
  fetchMovies,
  fetchMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  importMovies,
  clearError,
  clearSelectedMovie,
  clearCurrentQuery,
  setImportProgress
} from '@/store/slices/movieSlice';
import { addNotification } from '@/store/slices/uiSlice';
import {
  selectMovies,
  selectMoviesLoading,
  selectMoviesError,
  selectSelectedMovie,
  selectSelectedMovieLoading,
  selectSelectedMovieError,
  selectIsImporting,
  selectIsInitialized,
  selectTotalMovies,
  selectCurrentQuery,
  selectIsSearchActive,
  selectCreateMovieLoading,
  selectUpdateMovieLoading,
  selectDeleteMovieLoading,
  selectImportProgress
} from '@/store/selectors';
import { MovieCreateRequest } from '@/types/movie';

export const useMovies = () => {
  const dispatch = useAppDispatch();

  const movies = useAppSelector(selectMovies);
  const selectedMovie = useAppSelector(selectSelectedMovie);
  const selectedMovieLoading = useAppSelector(selectSelectedMovieLoading);
  const selectedMovieError = useAppSelector(selectSelectedMovieError);
  const moviesLoading = useAppSelector(selectMoviesLoading);
  const moviesError = useAppSelector(selectMoviesError);
  const createMovieLoading = useAppSelector(selectCreateMovieLoading);
  const updateMovieLoading = useAppSelector(selectUpdateMovieLoading);
  const deleteMovieLoading = useAppSelector(selectDeleteMovieLoading);
  const isInitialized = useAppSelector(selectIsInitialized);
  const isImporting = useAppSelector(selectIsImporting);
  const importProgress = useAppSelector(selectImportProgress);
  const totalMovies = useAppSelector(selectTotalMovies);
  const currentQuery = useAppSelector(selectCurrentQuery);
  const isSearchActive = useAppSelector(selectIsSearchActive);

  const loadMovies = useCallback(async (params?: {
    sort?: 'id' | 'title' | 'year';
    order?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
    actor?: string;
    title?: string;
    search?: string;
    format?: string;
  }) => {
    try {
      await dispatch(fetchMovies(params || {})).unwrap();
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to load movies',
      }));
    }
  }, [dispatch]);

  const loadMovieById = useCallback(async (movieId: string) => {
    try {
      await dispatch(fetchMovieById(movieId)).unwrap();
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to load movie details',
      }));
    }
  }, [dispatch]);

  const addMovie = useCallback(async (movieData: MovieCreateRequest) => {
    try {
      await dispatch(createMovie(movieData)).unwrap();
      dispatch(addNotification({
        type: 'success',
        message: 'Movie added successfully!',
      }));
      return true;
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to add movie',
      }));
      return false;
    }
  }, [dispatch]);

  const editMovie = useCallback(async (id: string, movieData: Partial<MovieCreateRequest>) => {
    try {
      await dispatch(updateMovie({ id, data: movieData })).unwrap();
      dispatch(addNotification({
        type: 'success',
        message: 'Movie updated successfully!',
      }));
      return true;
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to update movie',
      }));
      return false;
    }
  }, [dispatch]);

  const removeMovie = useCallback(async (movieId: string) => {
    try {
      await dispatch(deleteMovie(movieId)).unwrap();
      dispatch(addNotification({
        type: 'success',
        message: 'Movie deleted successfully!',
      }));
      return true;
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to delete movie',
      }));
      return false;
    }
  }, [dispatch]);

  const searchMoviesByTitle = useCallback(async (title: string, options?: {
    sort?: 'id' | 'title' | 'year';
    order?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
  }) => {
    await loadMovies({
      title,
      search: title,
      ...options
    });
  }, [loadMovies]);

  const searchMoviesByActor = useCallback(async (actor: string, options?: {
    sort?: 'id' | 'title' | 'year';
    order?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
  }) => {
    await loadMovies({
      actor,
      search: actor,
      ...options
    });
  }, [loadMovies]);

  const searchMovies = useCallback(async (searchParams: {
    title?: string;
    actor?: string;
    search?: string;
    format?: string;
    sort?: 'id' | 'title' | 'year';
    order?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
  }) => {
    await loadMovies(searchParams);
  }, [loadMovies]);

  const clearSearch = useCallback(async (options?: {
    sort?: 'id' | 'title' | 'year';
    order?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
  }) => {
    dispatch(clearCurrentQuery());
    await loadMovies(options);
  }, [dispatch, loadMovies]);

  const loadNextPage = useCallback(async () => {
    const currentOffset = currentQuery.offset || 0;
    const currentLimit = currentQuery.limit || 50;

    await loadMovies({
      ...currentQuery,
      offset: currentOffset + currentLimit
    });
  }, [currentQuery, loadMovies]);

  const loadPage = useCallback(async (page: number, pageSize?: number) => {
    const limit = pageSize || currentQuery.limit || 50;
    const offset = (page - 1) * limit;

    await loadMovies({
      ...currentQuery,
      limit,
      offset
    });
  }, [currentQuery, loadMovies]);

  const sortMovies = useCallback(async (sort: 'id' | 'title' | 'year', order: 'ASC' | 'DESC' = 'ASC') => {
    await loadMovies({
      ...currentQuery,
      sort,
      order,
      offset: 0
    });
  }, [currentQuery, loadMovies]);

  const importMoviesFromFile = useCallback(async (file: File) => {
    try {
      const result = await dispatch(importMovies(file)).unwrap();
      dispatch(addNotification({
        type: 'success',
        message: `Successfully imported ${result.meta.imported} movies!`,
      }));

      if (result.meta.total > result.meta.imported) {
        dispatch(addNotification({
          type: 'warning',
          message: `${result.meta.total - result.meta.imported} movies were skipped or failed to import.`,
        }));
      }

      return true;
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to import movies',
      }));
      return false;
    }
  }, [dispatch]);

  const clearMoviesError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearSelectedMovieData = useCallback(() => {
    dispatch(clearSelectedMovie());
  }, [dispatch]);

  const resetImportProgress = useCallback(() => {
    dispatch(setImportProgress(null));
  }, [dispatch]);

  const hasNextPage = useCallback(() => {
    const currentOffset = currentQuery.offset || 0;
    const currentLimit = currentQuery.limit || 50;
    return currentOffset + currentLimit < totalMovies;
  }, [currentQuery, totalMovies]);

  const hasPreviousPage = useCallback(() => {
    const currentOffset = currentQuery.offset || 0;
    return currentOffset > 0;
  }, [currentQuery]);

  const getCurrentPage = useCallback(() => {
    const currentOffset = currentQuery.offset || 0;
    const currentLimit = currentQuery.limit || 50;
    return Math.floor(currentOffset / currentLimit) + 1;
  }, [currentQuery]);

  const getTotalPages = useCallback(() => {
    const currentLimit = currentQuery.limit || 20;
    return Math.ceil(totalMovies / currentLimit);
  }, [currentQuery, totalMovies]);

  return {
    movies,
    selectedMovie,
    importProgress,
    totalMovies,
    currentQuery,

    moviesLoading,
    selectedMovieLoading,
    createMovieLoading,
    updateMovieLoading,
    deleteMovieLoading,
    isImporting,
    isSearchActive,
    isInitialized,

    moviesError,
    selectedMovieError,

    loadMovies,
    loadMovieById,
    addMovie,
    editMovie,
    removeMovie,

    searchMoviesByTitle,
    searchMoviesByActor,
    searchMovies,
    clearSearch,

    loadNextPage,
    loadPage,
    hasNextPage,
    hasPreviousPage,
    getCurrentPage,
    getTotalPages,

    sortMovies,

    importMoviesFromFile,

    clearMoviesError,
    clearSelectedMovieData,
    resetImportProgress,
  };
};