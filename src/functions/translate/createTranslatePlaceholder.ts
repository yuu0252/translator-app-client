import { languageCodeList } from '../../constants';

export const createTranslatePlaceholder = () => {
  const placeholderList = languageCodeList.map(
    (language) => language.placeholder
  );
  const placeholdersList = [
    '相手に先に喋ってもらうか(自動検出)、',
    '言語を選んでください(右上)',
    ...placeholderList.filter((str) => str !== undefined),
  ];
  const placeholder = placeholdersList.join(`\n`);

  return placeholder;
};
