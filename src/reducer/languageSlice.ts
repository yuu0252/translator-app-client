import { createSlice } from '@reduxjs/toolkit';

export const languageSlice = createSlice({
  name: 'language',
  initialState: {
    language: 'none',
    isJapanese: true,
  },
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setIsJapanese: (state, action) => {
      state.isJapanese = action.payload;
    },
  },
});

export const { setLanguage, setIsJapanese } = languageSlice.actions;

export const selectLanguage = (state: any) => state.language;

export default languageSlice.reducer;
