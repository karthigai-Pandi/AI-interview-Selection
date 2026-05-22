import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  notifications: Array<{ id: string; title: string; message: string; type: 'info' | 'success' | 'warning' | 'error' }>;
}

const initialState: UIState = {
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<UIState['notifications'][number]>) {
      state.notifications.unshift(action.payload);
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addNotification, removeNotification } = uiSlice.actions;
export default uiSlice.reducer;
