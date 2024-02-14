import axios from "axios";
import { languageCodeList } from "../../constants";
import { setTranscription, setOutputText } from "../../reducer/translateSlice";
import { setIsLoading } from "../../reducer/loadingSlice";
import { speechToTextResult } from "./speechToTextResult";
import store from "../../reducer/store";

export const speechToText = (base64data: string) => {
  const { currentLanguage } = store.getState().language;

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
      const [sourceLanguage, targetLanguage, text] = speechToTextResult(
        result,
        currentLanguage
      );

      // 出力されたテキストを翻訳する
      axios
        .post(
          `${import.meta.env.VITE_TRANSLATE_URL}?key=${
            import.meta.env.VITE_GOOGLE_API_KEY
          }`,
          {
            q: text,
            source: sourceLanguage,
            target: targetLanguage,
            format: "text",
          }
        )
        .then((res) => {
          const translatedText = res.data.data.translations[0].translatedText;
          const handleResultTranslate = (translatedText: string) => {
            store.dispatch(setOutputText(translatedText));
            store.dispatch(setIsLoading(false));
          };
          handleResultTranslate(translatedText);
        })
        .catch(() => {
          store.dispatch(setOutputText("翻訳に失敗しました"));
          store.dispatch(setIsLoading(false));
        });
    })
    .catch(() => {
      store.dispatch(setTranscription("音声認識に失敗しました"));
      store.dispatch(setIsLoading(false));
    });
};
