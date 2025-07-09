import { useCallback } from 'react';
import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import {
  registerUser,
  loginUser,
  logoutUser,
  clearError,
  loadTokenFromStorage,
} from '@/store/slices/authSlice';
import { addNotification } from '@/store/slices/uiSlice';
import {
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from '@/store/selectors';
import { LoginRequest, RegisterRequest } from '@/types/auth';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      await dispatch(registerUser(userData)).unwrap();
      dispatch(addNotification({
        type: 'success',
        message: 'Registration successful!',
      }));
      return true;
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Registration failed',
      }));
      return false;
    }
  }, [dispatch]);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      await dispatch(loginUser(credentials)).unwrap();
      dispatch(addNotification({
        type: 'success',
        message: 'Login successful!',
      }));
      return true;
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Login failed',
      }));
      return false;
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(addNotification({
        type: 'info',
        message: 'Logged out successfully',
      }));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Logout failed',
      }));
    }
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const initializeAuth = useCallback(() => {
    dispatch(loadTokenFromStorage());
  }, [dispatch]);

  return {
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
    clearAuthError,
    initializeAuth,
  };
};