import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification, UiState } from '@/types/store';

const initialState: UiState = {
    isModalOpen: false,
    modalType: null,
    notifications: [],
    isImporting: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<'add' | 'edit' | 'delete' | 'view' | 'login' | 'register'>) => {
            state.isModalOpen = true;
            state.modalType = action.payload;
        },
        closeModal: (state) => {
            state.isModalOpen = false;
            state.modalType = null;
        },
        addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
            const notification: Notification = {
                id: Date.now().toString(),
                ...action.payload,
            };
            state.notifications.push(notification);
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(
                notification => notification.id !== action.payload
            );
        },
        setImporting: (state, action: PayloadAction<boolean>) => {
            state.isImporting = action.payload;
        },
    },
});
export const {
    openModal,
    closeModal,
    addNotification,
    removeNotification,
    setImporting,
} = uiSlice.actions;

export default uiSlice.reducer;