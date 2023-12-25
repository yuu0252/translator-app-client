import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './languageSlice';
import translateReducer from './translateSlice';
import loadingReducer from './loadingSlice';

const store = configureStore({
  reducer: {
    language: languageReducer,
    translate: translateReducer,
    loading: loadingReducer,
  },
});

export default store;
