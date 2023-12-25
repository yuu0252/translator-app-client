type obj = {
  code: string;
  query: string;
  name: string;
  placeholder?: string;
  speak: {
    code: string;
    speaker: string;
  };
  rate: { code: string; sign: string };
};

export const languageCodeList: Array<obj> = [
  {
    code: 'en-us',
    query: 'en',
    name: '英語（アメリカ）',
    placeholder: 'Speak your language',
    speak: { code: 'en-US', speaker: 'en-US-Neural2-J' },
    rate: { code: 'USD', sign: '$' },
  },
  {
    code: 'en-gb',
    query: 'en',
    name: '英語（イギリス）',
    speak: { code: 'en-GB', speaker: 'en-GB-Neural2-C' },
    rate: { code: 'GBP', sign: '£' },
  },
  {
    code: 'en-sg',
    query: 'en',
    name: '英語（シンガポール）',
    speak: { code: 'en-US', speaker: 'en-US-Neural2-J' },
    rate: { code: 'SGD', sign: 'S$' },
  },
  {
    code: 'yue-hant-hk',
    query: 'zh-tw',
    name: '繁体字（香港）',
    placeholder: '說你的語言',
    speak: { code: 'cmn-TW', speaker: 'cmn-TW-Wavenet-A' },
    rate: { code: 'HKD', sign: '$' },
  },
  {
    code: 'cmn-hant-tw',
    query: 'zh-tw',
    name: '繁体字（台湾）',
    speak: { code: 'cmn-TW', speaker: 'cmn-TW-Wavenet-A' },
    rate: { code: 'TWD', sign: 'NT$' },
  },
  {
    code: 'cmn-hans-cn',
    query: 'zh-cn',
    name: '簡体字（中国）',
    placeholder: '说你的语言',
    speak: { code: 'cmn-CN', speaker: 'cmn-CN-Wavenet-C' },
    rate: { code: 'CNY', sign: '￥' },
  },
  {
    code: 'fil-ph',
    query: 'fil',
    name: 'タガログ語（フィリピン）',
    placeholder: 'magsalita ng iyong wika',
    speak: { code: 'fil-PH', speaker: 'fil-ph-Neural2-A' },
    rate: { code: 'PHP', sign: '₱' },
  },
  {
    code: 'th-th',
    query: 'th',
    name: 'タイ語（タイ）',
    placeholder: 'พูดภาษาของคุณ',
    speak: { code: 'th-TH', speaker: 'th-TH-Neural2-C' },
    rate: { code: 'THB', sign: '฿' },
  },
  {
    code: 'id-id',
    query: 'id',
    name: 'インドネシア語（インドネシア）',
    placeholder: 'berbicaralah dalam bahasa Anda',
    speak: { code: 'id-ID', speaker: 'id-ID-Wavenet-D' },
    rate: { code: 'IDR', sign: 'Rp' },
  },
  {
    code: 'ms-my',
    query: 'ms',
    name: 'マレー語（マレーシア）',
    placeholder: 'bercakap bahasa anda',
    speak: { code: 'ms-MY', speaker: 'ms-MY-Wavenet-D' },
    rate: { code: 'MYR', sign: 'RM' },
  },
  {
    code: 'vi-vn',
    query: 'vi',
    name: 'ベトナム語（ベトナム）',
    placeholder: 'nói ngôn ngữ của bạn',
    speak: { code: 'vi-VN', speaker: 'vi-VN-Wavenet-A' },
    rate: { code: 'VND', sign: '₫' },
  },
  {
    code: 'ko-kr',
    query: 'ko',
    name: '韓国語（韓国）',
    placeholder: '언어로 말하기',
    speak: { code: 'ko-KR', speaker: 'ko-KR-Wavenet-A' },
    rate: { code: 'KRW', sign: '₩' },
  },
  {
    code: 'fr-fr',
    query: 'fr',
    name: 'フランス語（フランス）',
    placeholder: 'parle ta langue',
    speak: { code: 'fr-FR', speaker: 'fr-FR-Neural2-C' },
    rate: { code: 'EUR', sign: '€' },
  },
  {
    code: 'de-de',
    query: 'de',
    name: 'ドイツ語（ドイツ）',
    placeholder: 'deine Sprache zu sprechen',
    speak: { code: 'de-DE', speaker: 'de-DE-Wavenet-F' },
    rate: { code: 'EUR', sign: '€' },
  },
  {
    code: 'it-it',
    query: 'it',
    name: 'イタリア語（イタリア）',
    placeholder: 'parla la tua lingua',
    speak: { code: 'it-IT', speaker: 'it-IT-Wavenet-B' },
    rate: { code: 'EUR', sign: '€' },
  },
  {
    code: 'hi-in',
    query: 'hi',
    name: 'ヒンディー語（インド）',
    placeholder: 'अपनी भाषा बोलें',
    speak: { code: 'hi-IN', speaker: 'hi-IN-Wavenet-C' },
    rate: { code: 'INR', sign: '₹' },
  },
  {
    code: 'pt-br',
    query: 'pt',
    name: 'ポルトガル語（ブラジル）',
    placeholder: 'fale sua língua',
    speak: { code: 'pt-BR', speaker: 'pt-BR-Wavenet-B' },
    rate: { code: 'BRL', sign: 'R$' },
  },
  {
    code: 'uk-ua',
    query: 'uk',
    name: 'ウクライナ語（ウクライナ）',
    placeholder: 'говорити своєю мовою',
    speak: { code: 'uk-UA', speaker: 'uk-UA-Wavenet-A' },
    rate: { code: 'UAH', sign: '₴' },
  },
  {
    code: 'ru-ru',
    query: 'ru',
    name: 'ロシア語（ロシア）',
    placeholder: 'говори на своем языке',
    speak: { code: 'ru-RU', speaker: 'ru-RU-Wavenet-A' },
    rate: { code: 'RUB', sign: '₽' },
  },
  {
    code: 'ar-ae',
    query: 'ar',
    name: 'アラビア語（アラブ首長国連邦）',
    placeholder: 'تحدث لغتك',
    speak: { code: 'ar-XA', speaker: 'ar-XA-Wavenet-C' },
    rate: { code: 'AED', sign: 'د. إ' },
  },
  {
    code: 'en-hk',
    query: 'en',
    name: '英語（香港）',
    speak: { code: 'en-GB', speaker: 'en-GB-Neural2-C' },
    rate: { code: 'HKD', sign: '$' },
  },
  {
    code: 'en-ph',
    query: 'en',
    name: '英語（フィリピン）',
    speak: { code: 'en-US', speaker: 'en-US-Neural2-F' },
    rate: { code: 'PHP', sign: '₱' },
  },
  {
    code: 'en-ca',
    query: 'en',
    name: '英語（カナダ）',
    speak: { code: 'en-US', speaker: 'en-US-Neural2-E' },
    rate: { code: 'CAD', sign: 'C$' },
  },
  {
    code: 'en-au',
    query: 'en',
    name: '英語（オーストラリア）',
    speak: { code: 'en-AU', speaker: 'en-AU-Wavenet-C' },
    rate: { code: 'AUD', sign: 'AU$' },
  },
  {
    code: 'en-nz',
    query: 'en',
    name: '英語（ニュージーランド）',
    speak: { code: 'en-AU', speaker: 'en-AU-Wavenet-C' },
    rate: { code: 'NZD', sign: '$' },
  },
  {
    code: 'en-in',
    query: 'en',
    name: '英語（インド）',
    speak: { code: 'en-IN', speaker: 'en-IN-Wavenet-D' },
    rate: { code: 'INR', sign: '₹' },
  },
];
