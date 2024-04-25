import { createSlice } from "@reduxjs/toolkit";

export const statusSlice = createSlice({
  name: "status",
  initialState: {
    isLoading: false, // 録音後に翻訳後のテキストが出力されるまでfalse
    isPlaying: false, // 音声再生中に二重で音声を再生させないようにするステート
    isSuccess: false, // 音声認識や翻訳が成功しているかを保持するステート
  },
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    setIsSuccess: (state, action) => {
      state.isSuccess = action.payload;
    },
  },
});

export const { setIsLoading, setIsPlaying, setIsSuccess } = statusSlice.actions;

export const selectStatus = (state: {
  status: { isLoading: boolean; isPlaying: boolean; isSuccess: boolean };
}) => state.status;

export default statusSlice.reducer;
