import { createSlice } from '@reduxjs/toolkit';

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    isLoading: false, // 録音後に翻訳後のテキストが出力されるまでfalse
  },
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setIsLoading } = loadingSlice.actions;

export const selectLoading = (state: { loading: { isLoading: boolean } }) =>
  state.loading;

export default loadingSlice.reducer;
