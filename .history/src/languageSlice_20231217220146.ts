import { createSlice } from '@reduxjs/toolkit';

export const languageSlice = createSlice({
  name: 'language',
  initialState: {
    language: '',
  },
  reducers: {
    selectLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});
