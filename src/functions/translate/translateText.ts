import axios from "axios";

type successHandlerType = (translatedText: string) => void;
type errorHandlerType = () => void;

// テキストを設定言語に翻訳
export const translateText = async (
  text: string | undefined,
  sourceLanguage: string | undefined,
  targetLanguage: string | undefined,
  // 使用する箇所によって違う処理を実行するのでそれぞれ関数で渡す
  successHandler: successHandlerType,
  errorHandler: errorHandlerType
) => {
  const data = {
    q: text,
    source: sourceLanguage,
    target: targetLanguage,
    format: "text",
  };

  const result = await axios
    .post(
      `${import.meta.env.VITE_TRANSLATE_URL}?key=${
        import.meta.env.VITE_GOOGLE_API_KEY
      }`,
      data
    )
    .then((res) => {
      const translatedText = res.data.data.translations[0].translatedText;
      successHandler(translatedText);
    })
    .catch(() => {
      errorHandler();
    });

  return result;
};
