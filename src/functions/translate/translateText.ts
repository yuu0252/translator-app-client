import axios from "axios";

export const translateText = async (
  text: string,
  language: string,
  isJapanese: boolean
  // 関数をそれぞれのものを渡す（成功と失敗)
) => {
  const source = language !== "none" ? (isJapanese ? "ja" : language) : null;
  const target = isJapanese ? language : "ja";

  console.log(text + ":" + source + ":" + target);

  const data = source
    ? {
        q: text,
        source: source,
        target: target,
        format: "text",
      }
    : { q: text, target: "ja", format: "text" };

  const result = await axios
    .post(
      `${import.meta.env.VITE_TRANSLATE_URL}?key=${
        import.meta.env.VITE_GOOGLE_API_KEY
      }`,
      data
    )
    .then((res) => {
      console.log(res.data);
      const result = res.data.data.translations[0].translatedText;
      // 場合わけ
      // 引数にresult
      return result; // 消す
    })
    .catch((err) => {
      console.log(err);
      return "翻訳に失敗しました";
    });

  return result;
};
