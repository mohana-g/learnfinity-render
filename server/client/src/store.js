// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import courseReducer from './slices/courseSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    courses: courseReducer,
  },
});
