import { createSlice } from "@reduxjs/toolkit";

export const statusSlice = createSlice({
  name: "status",
  initialState: {
    isLoading: false, // 録音後に翻訳後のテキストが出力されるまでfalse
    isPlaying: false,
  },
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
  },
});

export const { setIsLoading, setIsPlaying } = statusSlice.actions;

export const selectStatus = (state: {
  status: { isLoading: boolean; isPlaying: boolean };
}) => state.status;

export default statusSlice.reducer;
