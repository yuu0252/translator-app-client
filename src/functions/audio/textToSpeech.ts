import axios from 'axios';
import { Howl } from 'howler';
import { isMobile, isTablet } from 'react-device-detect';

export const textToSpeech = async (
  text: string,
  languageCode: string,
  speaker: string
) => {
  const data = {
    audioConfig: {
      effectsProfileId: ['handset-class-device'],
      audioEncoding: 'MP3',
      pitch: 0,
      speakingRate: 1,
      volumeGainDb: 16,
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
      const base64 = res.data.audioContent;
      const contentType = 'audio/mp3';
      const volume = isMobile || isTablet ? 10 : 1;
      const sound = new Howl({
        src: [`data:${contentType};base64,${base64}`],
        volume: volume,
      });
      sound.play();
    })
    .catch((err) => {
      console.log(err);
      alert('音声合成に失敗しました');
    });

  return result;
};
