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

export type imageOutputData = {
  outputText: string;
  style: object;
};

export type loadImageResult = {
  naturalWidth: number;
  naturalHeight: number;
};

export type imageTranslatedData = {
  outputText: string;
  style: object;
};

export type recognizedData = {
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

export type imageRecognizedResult = {
  text: string;
  boundingBox: [x: number, y: number];
};
