import axios from "axios";
import { languageCodeList } from "../../constants";
import { setTranscription, setOutputText } from "../../reducer/translateSlice";
import { setIsLoading, setIsSuccess } from "../../reducer/statusSlice";
import { resultSpeechToText } from "./resultSpeechToText";
import store from "../../reducer/store";
import { translateText } from "../translate/translateText";

// 音声をテキストに変換する
export const speechToText = (base64data: string) => {
  const { currentLanguage } = store.getState().language;

  const successHandlerTranslation = (translatedText: string) => {
    store.dispatch(setOutputText(translatedText));
    store.dispatch(setIsSuccess(true));
    store.dispatch(setIsLoading(false));
  };

  const errorHandlerTranslation = () => {
    store.dispatch(setOutputText("翻訳に失敗しました"));
    store.dispatch(setIsLoading(false));
  };

  // google translate APIの複数言語設定
  const altLanguageCodes =
    currentLanguage === "none"
      ? languageCodeList.map((language) => language.code)
      : [currentLanguage];
  // 音声をテキストに変換
  axios
    .post(
      `${import.meta.env.VITE_SPEECH_TO_TEXT_URL}?key=${
        import.meta.env.VITE_GOOGLE_API_KEY
      }`,
      {
        config: {
          languageCode: "ja-JP",
          alternativeLanguageCodes: altLanguageCodes,
        },
        audio: {
          content: base64data.split(",")[1],
        },
      }
    )
    .then((res) => {
      const result = res.data.results[0];
      // 返ってきたデータの必要な部分を抽出する
      const [sourceLanguage, targetLanguage, text] = resultSpeechToText(
        result,
        currentLanguage
      );
      // 出力されたテキストを翻訳する
      translateText(
        text,
        sourceLanguage,
        targetLanguage,
        successHandlerTranslation,
        errorHandlerTranslation
      );
    })
    .catch(() => {
      store.dispatch(setTranscription("音声認識に失敗しました"));
      store.dispatch(setIsLoading(false));
    });
};
