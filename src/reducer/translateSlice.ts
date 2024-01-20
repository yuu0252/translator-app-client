import { createSlice } from '@reduxjs/toolkit';

export const translateSlice = createSlice({
  name: 'translate',
  initialState: {
    transcription: '',
    outputText: '',
  },
  reducers: {
    setTranscription: (state, action) => {
      state.transcription = action.payload;
    },
    setOutputText: (state, action) => {
      state.outputText = action.payload;
    },
  },
});

export const { setTranscription, setOutputText } = translateSlice.actions;

export const selectTranslate = (state: {
  translate: {
    transcription: string;
    outputText: string;
  };
}) => state.translate;

export default translateSlice.reducer;
