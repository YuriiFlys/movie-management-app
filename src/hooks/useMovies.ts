import { useCallback } from 'react';
import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import {
  fetchMovies,
  fetchMovieById,
  clearError,
  clearSelectedMovie
} from '@/store/slices/movieSlice';
import { addNotification } from '@/store/slices/uiSlice';
import {
  selectMovies,
  selectMoviesLoading,
  selectMoviesError,
  selectSelectedMovie
} from '@/store/selectors';

export const useMovies = () => {
  const dispatch = useAppDispatch();

  const movies = useAppSelector(selectMovies);
  const selectedMovie = useAppSelector(selectSelectedMovie);
  const loading = useAppSelector(selectMoviesLoading);
  const error = useAppSelector(selectMoviesError);

  const loadMovies = useCallback(async (params?: {
    sort?: 'id' | 'title' | 'year';
    order?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
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

  const clearMoviesError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearSelectedMovieData = useCallback(() => {
    dispatch(clearSelectedMovie());
  }, [dispatch]);

  return {
    movies,
    selectedMovie,
    loading,
    error,
    loadMovies,
    loadMovieById,
    clearMoviesError,
    clearSelectedMovieData,
  };
};