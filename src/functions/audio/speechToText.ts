import axios from "axios";
import { languageCodeList } from "../../constants";
import { setIsJapanese, setCurrentLanguage } from "../../reducer/languageSlice";
import { setTranscription, setOutputText } from "../../reducer/translateSlice";
import { selectLanguage } from "../../reducer/languageSlice";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../../reducer/loadingSlice";

export const speechToText = (base64data: string) => {
  const { currentLanguage } = useSelector(selectLanguage);
  const dispatch = useDispatch();

  // google translate APIの複数言語設定
  const altLanguageCodes =
    currentLanguage === "none"
      ? languageCodeList.map((language) => language.code)
      : [currentLanguage];
  // 音声をテキストに変換
  axios // 切り出す
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
      // thenの中身関数に
      const result = res.data.results[0];
      const detectedLanguage = result.languageCode;
      const text = result.alternatives[0].transcript;

      // 入力言語が日本語かどうか
      dispatch(setIsJapanese(detectedLanguage === "ja-jp" ? true : false));

      let sourceLanguage: string | undefined;
      let targetLanguage: string | undefined;

      // 入力が日本語であるときに出力言語が設定されていなければ英語に変換する
      // 引数でdetectedとcurrent渡す
      if (detectedLanguage === "ja-jp" && currentLanguage === "none") {
        dispatch(setCurrentLanguage("en-us"));
        sourceLanguage = "ja";
        targetLanguage = "en";
      } else if (detectedLanguage === "ja-jp") {
        dispatch(setCurrentLanguage(detectedLanguage));
        const targetCode = languageCodeList.find(
          (e) => e.code === currentLanguage
        );
        sourceLanguage = "ja";
        targetLanguage = targetCode?.shortCode;
      } else {
        if (detectedLanguage !== "ja-jp" && currentLanguage === "none") {
          dispatch(setCurrentLanguage(detectedLanguage));
        }
        const sourceCode = languageCodeList.find(
          (e) => e.code === detectedLanguage
        );
        sourceLanguage = sourceCode?.shortCode;
        targetLanguage = "ja";
      }

      //sourceとtargetとcurrent返す関数

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
