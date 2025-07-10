import { useCallback } from 'react';
import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import { fetchMovies, clearError } from '@/store/slices/movieSlice';
import { addNotification } from '@/store/slices/uiSlice';
import { selectMovies, selectMoviesLoading, selectMoviesError } from '@/store/selectors';

export const useMovies = () => {
  const dispatch = useAppDispatch();

  const movies = useAppSelector(selectMovies);
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

  const clearMoviesError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    movies,
    loading,
    error,
    loadMovies,
    clearMoviesError,
  };
};