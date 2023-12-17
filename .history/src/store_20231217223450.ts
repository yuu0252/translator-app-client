import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    language: languageReducer,
  },
});

export default store;
