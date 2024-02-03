import axios from "axios";
import { languageCodeList } from "../../constants";
import { setCurrentLanguage } from "../../reducer/languageSlice";
import { setTranscription, setOutputText } from "../../reducer/translateSlice";
import { selectLanguage } from "../../reducer/languageSlice";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../../reducer/loadingSlice";
import { speechToTextResult } from "./speechToTextResult";

export const speechToText = (base64data: string) => {
  const { currentLanguage } = useSelector(selectLanguage);
  const dispatch = useDispatch();

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
      const [sourceLanguage, targetLanguage, currentLanguage, text] =
        speechToTextResult(result);
      dispatch(setCurrentLanguage(currentLanguage));
      dispatch(setTranscription(text));

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
            dispatch(setOutputText(translatedText));
            dispatch(setIsLoading(false));
          };
          handleResultTranslate(translatedText);
        })
        .catch(() => {
          dispatch(setOutputText("翻訳に失敗しました"));
          dispatch(setIsLoading(false));
        });
    })
    .catch(() => {
      dispatch(setTranscription("音声認識に失敗しました"));
      dispatch(setIsLoading(false));
    });
};
