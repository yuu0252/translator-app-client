import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './languageSlice';
import translateReducer from './translateSlice';
import loadingReducer from './loadingSlice';
import loginReducer from './loginSlice';

const store = configureStore({
  reducer: {
    language: languageReducer,
    translate: translateReducer,
    loading: loadingReducer,
    login: loginReducer,
  },
});

export default store;
