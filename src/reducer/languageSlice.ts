import { createSlice } from '@reduxjs/toolkit';
import { TypeCurrentLanguage } from '../type';

export const languageSlice = createSlice({
  name: 'language',
  initialState: {
    currentLanguage: 'none', // ドロップダウンで選択されている言語
    isJapanese: true, // 入力側が日本語であるか
  },
  reducers: {
    setCurrentLanguage: (state, action) => {
      state.currentLanguage = action.payload;
    },
    setIsJapanese: (state, action) => {
      state.isJapanese = action.payload;
    },
  },
});

export const { setCurrentLanguage, setIsJapanese } = languageSlice.actions;

export const selectLanguage = (state: {
  language: { currentLanguage: TypeCurrentLanguage; isJapanese: boolean };
}) => state.language;

export default languageSlice.reducer;
