export type TypeLanguageCode = {
  code: string;
  shortCode: string;
  name: string;
  placeholder?: string;
  speak: {
    code: string;
    speaker: string;
  };
};

export type TypeCurrentLanguage =
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

export type TypeResultSpeechToText = {
  languageCode: string;
  alternatives: [
    {
      transcript: string;
    }
  ];
};

export type TypeImageOutputData = {
  outputText: string;
  style: object;
};

export type TypeLoadImageResult = {
  naturalWidth: number;
  naturalHeight: number;
};

export type TypeImageTranslatedData = {
  outputText: string;
  style: object;
};

export type TypeRecognizedData = {
  responses: [
    {
      fullTextAnnotation: {
        pages: [
          {
            blocks: [
              {
                paragraphs: [
                  {
                    words: [
                      {
                        symbols: [
                          symbol: {
                            text: string;
                          }
                        ];
                      }
                    ];
                  }
                ];
                boundingBox: {
                  vertices: [x: number, y: number];
                };
              }
            ];
          }
        ];
      };
    }
  ];
};

export type TypeImageRecognizedResult = {
  text: string;
  boundingBox: [x: number, y: number];
};

// ログイン
export type TypeUserForm = {
  email: string;
  password: string;
};

export type TypeOnSubmitUserForm = (data: TypeUserForm) => void;
