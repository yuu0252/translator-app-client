import axios from 'axios';

export const translateText = async (
  text: string,
  language: string,
  isJapanese: boolean
) => {
  const source = isJapanese ? 'ja' : language;
  const target = isJapanese ? language : 'ja';

  console.log(text + ':' + source + ':' + target);

  const result = await axios
    .post(
      `${import.meta.env.VITE_TRANSLATE_URL}?key=${
        import.meta.env.VITE_GOOGLE_API_KEY
      }`,
      {
        q: text,
        source: source,
        target: target,
        format: 'text',
      }
    )
    .then((res) => {
      const result = res.data.data.translations[0].translatedText;
      return result;
    })
    .catch((err) => {
      console.log(err);
      return '翻訳に失敗しました';
    });

  return result;
};
