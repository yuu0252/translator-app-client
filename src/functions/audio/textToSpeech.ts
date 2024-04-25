import axios from "axios";
import { Howl } from "howler";
import { isMobile, isTablet } from "react-device-detect";
import { languageCodeList } from "../../constants";
import store from "../../reducer/store";
import { setIsPlaying } from "../../reducer/statusSlice";

// 翻訳後のテキストを出力
export const textToSpeech = async (text: string, languageCode: string) => {
  const { isPlaying } = store.getState().status;
  if (isPlaying) return;
  const sourceLanguage = languageCode === "none" ? "en-us" : languageCode;
  const speaker =
    sourceLanguage === "ja-JP"
      ? "ja-JP-Neural2-C"
      : languageCodeList.find((e) => e.code === sourceLanguage)?.speak.speaker;
  const data = {
    audioConfig: {
      effectsProfileId: ["handset-class-device"],
      audioEncoding: "MP3",
      pitch: 0,
      speakingRate: 1,
      volumeGainDb: 1,
    },
    input: {
      text: text,
    },
    voice: {
      languageCode: sourceLanguage,
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
      const contentType = "audio/mp3";
      // PC以外のデバイスだと音量が少し小さいので音量を大きめに出力
      const volume = isMobile || isTablet ? 2 : 1;
      const sound = new Howl({
        src: [`data:${contentType};base64,${base64}`],
        volume: volume,
        onplay: () => {
          store.dispatch(setIsPlaying(true));
        },
        onend: () => {
          store.dispatch(setIsPlaying(false));
        },
      });
      sound.play();
    })
    .catch(() => {
      alert("音声合成に失敗しました");
    });

  return result;
};
