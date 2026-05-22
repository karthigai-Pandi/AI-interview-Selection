import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import workflowReducer from './slices/workflowSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    workflow: workflowReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
