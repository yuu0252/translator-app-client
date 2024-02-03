import { languageCodeList } from "../../constants";
import { TypeSpeechToTextResult } from "../../type";

export const speechToTextResult = (result: TypeSpeechToTextResult) => {
  const detectedLanguage = result.languageCode;
  const text = result.alternatives[0].transcript;

  // 入力言語が日本語かどうか
  const isJapanese = detectedLanguage === "ja-jp" ? true : false;

  let sourceLanguage: string | undefined;
  let targetLanguage: string | undefined;
  let currentLanguage: string | undefined;

  // 入力が日本語であるときに出力言語が設定されていなければ英語に変換する
  if (detectedLanguage === "ja-jp" && currentLanguage === "none") {
    currentLanguage = "en-us";
    sourceLanguage = "ja";
    targetLanguage = "en";
  } else if (detectedLanguage === "ja-jp") {
    currentLanguage = detectedLanguage;
    const targetCode = languageCodeList.find((e) => e.code === currentLanguage);
    sourceLanguage = "ja";
    targetLanguage = targetCode?.shortCode;
  } else {
    if (detectedLanguage !== "ja-jp" && currentLanguage === "none") {
      currentLanguage = detectedLanguage;
    }
    const sourceCode = languageCodeList.find(
      (e) => e.code === detectedLanguage
    );
    sourceLanguage = sourceCode?.shortCode;
    targetLanguage = "ja";
  }

  return [sourceLanguage, targetLanguage, currentLanguage, text, isJapanese];
};
