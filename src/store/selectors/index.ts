import { RootState } from '@/types';

export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export const selectIsModalOpen = (state: RootState) => state.ui.isModalOpen;
export const selectModalType = (state: RootState) => state.ui.modalType;
export const selectNotifications = (state: RootState) => state.ui.notifications;
export const selectIsImporting = (state: RootState) => state.ui.isImporting;