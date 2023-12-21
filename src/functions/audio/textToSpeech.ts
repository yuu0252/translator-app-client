import axios from 'axios';
import { base64ToBlobUrl } from './base64ToBlobUrl';

export const textToSpeech = async (
  text: string,
  languageCode: string,
  speaker: string
) => {
  const data = {
    audioConfig: {
      audioEncoding: 'LINEAR16',
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

  const result = await axios
    .post(
      `${import.meta.env.VITE_TEXT_TO_SPEECH_URL}?key=${
        import.meta.env.VITE_GOOGLE_API_KEY
      }`,
      data
    )
    .then((res) => {
      try {
        const blobUrl = base64ToBlobUrl(res.data.audioContent);
        const audio = new Audio();
        audio.src = blobUrl;
        audio.play();
      } catch {
        alert('音声合成に失敗しました');
      }
    })
    .catch((err) => {
      console.log(err);
      alert('音声合成に失敗しました');
    });

  return result;
};
