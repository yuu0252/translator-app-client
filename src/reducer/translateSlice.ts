import { createSlice } from '@reduxjs/toolkit';

export const translateSlice = createSlice({
  name: 'translate',
  initialState: {
    transcription: '',
    outputText: '',
  },
  reducers: {
    setTranscription: (state, action) => {
      state.transcription = action.payload; // 音声認識後に出力されたテキストをtranscriptionステートに格納する
    },
    setOutputText: (state, action) => {
      state.outputText = action.payload; // 翻訳処理後に出力されたテキストをoutputTextステートに格納する
    },
  },
});

export const { setTranscription, setOutputText } = translateSlice.actions;

export const selectTranslate = (state: {
  translate: {
    transcription: string; // 翻訳前
    outputText: string;
  };
}) => state.translate;

export default translateSlice.reducer;
