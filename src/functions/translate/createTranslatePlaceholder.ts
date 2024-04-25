import { languageCodeList } from "../../constants";

// ホームに表示するプレースホルダーを最適な形に処理する
export const createTranslatePlaceholder = () => {
  const placeholderList = languageCodeList.map(
    (language) => language.placeholder
  );
  const placeholdersList = [
    "相手に先に喋ってもらうか(自動検出)、",
    "言語を選んでください(右上)",
    ...placeholderList.filter((str) => str !== undefined),
  ];
  const placeholder = placeholdersList.join(`\n`);

  return placeholder;
};
