import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './languageSlice';
import translateReducer from './translateSlice';

const store = configureStore({
  reducer: {
    language: languageReducer,
    translate: translateReducer,
  },
});

export default store;
