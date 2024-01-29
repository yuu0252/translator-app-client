export type languageCode = {
  code: string;
  shortCode: string;
  name: string;
  placeholder?: string;
  speak: {
    code: string;
    speaker: string;
  };
};

export type currentLanguage =
  | 'none'
  | 'en-us'
  | 'en-gb'
  | 'en-sg'
  | 'yue-hant-hk'
  | 'cmn-hant-tw'
  | 'cmn-hans-cn'
  | 'fil-ph'
  | 'th-th'
  | 'id-id'
  | 'ms-my'
  | 'vi-vn'
  | 'ko-kr'
  | 'fr-fr'
  | 'de-de'
  | 'it-it'
  | 'hi-in'
  | 'pt-br'
  | 'uk-ua'
  | 'ru-ru'
  | 'ar-ae'
  | 'en-hk'
  | 'en-ph'
  | 'en-ca'
  | 'en-au'
  | 'en-nz'
  | 'en-in';
