import { languageCodeList } from '../../constants';
import store from '../../reducer/store';
import { setCurrentLanguage } from '../../reducer/languageSlice';
import { setTranscription } from '../../reducer/translateSlice';
import { TypeResultSpeechToText } from '../../type';

// 入力された音声から翻訳するためのデータを抽出する
export const resultSpeechToText = (
  result: TypeResultSpeechToText,
  currentLanguage: string | undefined
) => {
  console.log(currentLanguage);
  const detectedLanguage = result.languageCode;
  const text = result.alternatives[0].transcript;

  store.dispatch(setTranscription(text)); // 翻訳する前のテキストをセット

  let sourceLanguage: string | undefined;
  let targetLanguage: string | undefined;

  // 入力が日本語であるときに出力言語が設定されていなければ英語に変換する
  if (detectedLanguage === 'ja-jp' && currentLanguage === 'none') {
    currentLanguage = 'en-us';
    sourceLanguage = 'ja';
    targetLanguage = 'en';
  } else if (detectedLanguage === 'ja-jp') {
    const targetCode = languageCodeList.find((e) => e.code === currentLanguage);
    sourceLanguage = 'ja';
    targetLanguage = targetCode?.shortCode;
    console.log(targetLanguage);
  } else {
    if (detectedLanguage !== 'ja-jp' && currentLanguage === 'none') {
      currentLanguage = detectedLanguage;
    }
    const sourceCode = languageCodeList.find(
      (e) => e.code === detectedLanguage
    );
    sourceLanguage = sourceCode?.shortCode;
    targetLanguage = 'ja';
  }
  store.dispatch(setCurrentLanguage(currentLanguage)); // 翻訳する言語をセット
  return [sourceLanguage, targetLanguage, text];
};
