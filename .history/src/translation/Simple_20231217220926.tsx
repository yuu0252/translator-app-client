import { useState } from 'react';
import { Recording } from '../components/Recording';
import { Header } from '../components/Header';

export const Simple = () => {
  const languageList = { English: '英語', 簡体字: '台湾・香港' };
  const placeholders = [
    '相手に先に喋ってもらうか(自動検出)、',
    '言語を選んでください(右上)',
    'Speak your language!',
    '说你的语言',
    '說你的語言',
    'พูดภาษาของคุณ',
    'nói ngôn ngữ của bạn',
    'magsalita ng iyong wika',
  ];
  const placeholder = placeholders.join(`\n`);
  const [transcription, setTranscription] = useState(placeholder);
  const [outputText, setOutputText] = useState('');
  const [language, setLanguage] = useState('');

  return (
    <Header />
    <section id="simple">
      <div className="textarea">
        <div className={transcription === placeholder ? 'placeholder' : ''}>
          <p>{transcription}</p>
          {outputText && <p>{outputText}</p>}
        </div>
      </div>
      <Recording
        setTranscription={setTranscription}
        setLanguage={setLanguage}
        setOutputText={setOutputText}
      />
    </section>
  );
};
