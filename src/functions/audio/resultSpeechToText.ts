import { languageCodeList } from "../../constants";
import store from "../../reducer/store";
import { setCurrentLanguage, setIsJapanese } from "../../reducer/languageSlice";
import { setTranscription } from "../../reducer/translateSlice";
import { TypeResultSpeechToText } from "../../type";

// 入力された音声から翻訳するためのデータを抽出する
export const resultSpeechToText = (
  result: TypeResultSpeechToText,
  currentLanguage: string | undefined
) => {
  const detectedLanguage = result.languageCode;
  const text = result.alternatives[0].transcript;

  store.dispatch(setTranscription(text)); // 翻訳する前のテキストをセット

  let sourceLanguage: string | undefined;
  let targetLanguage: string | undefined;

  // 入力が日本語であるときに出力言語が設定されていなければ英語に変換する
  if (detectedLanguage === "ja-jp" && currentLanguage === "none") {
    currentLanguage = "en-us";
    sourceLanguage = "ja";
    targetLanguage = "en";
  } else if (detectedLanguage === "ja-jp") {
    // 出力先言語が指定されていれば翻訳元を日本語に、翻訳先を指定の言語に変換する
    const targetCode = languageCodeList.find((e) => e.code === currentLanguage);
    sourceLanguage = "ja";
    targetLanguage = targetCode?.shortCode;
    store.dispatch(setIsJapanese(false));
  } else {
    // 入力言語が日本語以外であればその言語を日本語に翻訳する
    if (currentLanguage === "none") {
      currentLanguage = detectedLanguage;
    }
    const sourceCode = languageCodeList.find((e) => e.code === currentLanguage);
    sourceLanguage = sourceCode?.shortCode;
    targetLanguage = "ja";
    store.dispatch(setIsJapanese(false));
  }
  store.dispatch(setCurrentLanguage(currentLanguage)); // 翻訳する言語をセット
  return [sourceLanguage, targetLanguage, text];
};
