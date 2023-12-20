type obj = {
  code: string;
  query: string;
  name: string;
};

export const languageCodeList: Array<obj> = [
  { code: 'en-us', query: 'en', name: 'English(英語)' },
  { code: 'yue-hant-hk', query: 'zh-tw', name: '繁体字(香港)' },
  { code: 'cmn-hant-tw', query: 'zh-tw', name: '繁体字(台湾)' },
  { code: 'cmn-hans-cn', query: 'zh-cn', name: '简体字(中国)' },
  { code: 'fil-ph', query: 'fil', name: 'Pilipinas(フィリピン)' },
  { code: 'id-id', query: 'id', name: 'Indonesia(インドネシア)' },
  { code: 'ms-my', query: 'ms', name: 'Melayu(マレーシア)' },
  { code: 'ko-kr', query: 'ko', name: '한국(韓国)' },
  { code: 'vi-vn', query: 'vi', name: 'Việt Nam(ベトナム)' },
  { code: 'hi-in', query: 'hi', name: 'हिंदी(インド)' },
  { code: 'ru-ru', query: 'ru', name: 'Россия(ロシア)' },
  { code: 'ar-ae', query: 'ar', name: 'عربي(アラビア)' },
];
