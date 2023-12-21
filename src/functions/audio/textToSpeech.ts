import axios from 'axios';

export const textToSpeech = async (
  text: string,
  languageCode: string,
  speaker: string
) => {
  const data = {
    audioConfig: {
      audioEncoding: 'LINEAR16',
      effectsProfileId: ['handset-class-device'],
      pitch: 0,
      speakingRate: 1,
    },
    input: {
      text: text,
    },
    voice: {
      languageCode: languageCode,
      name: speaker,
    },
  };
  const result = await axios.post(
    `${import.meta.env.VITE_SPEECH_TO_TEXT_URL}$key=${
      import.meta.env.VITE_GOOGLE_API_KEY
    }`,
    data
  );

  return result;
};
