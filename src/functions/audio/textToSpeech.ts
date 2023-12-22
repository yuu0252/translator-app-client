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
        const audio_ctx = new AudioContext();
        let audio_buffer: any = null;
        let audio_buffer_node: any = null;

        (async () => {
          const response = await fetch(blobUrl);
          const response_buffer = await response.arrayBuffer();

          audio_buffer = await audio_ctx.decodeAudioData(response_buffer);

          prepareAudioBufferNode();

          audio_buffer_node.start(0);
        })();

        function prepareAudioBufferNode() {
          audio_buffer_node = audio_ctx.createBufferSource();
          audio_buffer_node.buffer = audio_buffer;
          audio_buffer_node.connect(audio_ctx.destination);
          audio_buffer_node.gain.value = 1;
        }
      } catch {
        alert('音声合成に失敗しました');
      }
    })
    .catch(() => {
      alert('音声合成に失敗しました');
    });

  return result;
};
