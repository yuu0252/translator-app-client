import { useState } from 'react';
import { Header } from '../components/Header';
import { Recording } from '../components/Recording';

export const Simple = () => {
  const placeholders = [
    '相手に先に喋ってもらうか(自動検出)、',
    '言語を選んでください(右上)',
    'Speak your language!',
    '说你的语言',
    '說你的語言',
    'magsalita ng iyong wika',
    'พูดภาษาของคุณ',
    'nói ngôn ngữ của bạn',
    'magsalita ng iyong wika',
  ];
  const placeholder = placeholders.join(`\n`);
  const [transcription, setTranscription] = useState(placeholder);
  const [outputText, setOutputText] = useState('');

  return (
    <>
      <Header />
      <section id="simple" className="container">
        <div className="content-area">
          <div className={transcription === placeholder ? 'placeholder' : ''}>
            <p>{transcription}</p>
            {outputText && <p>{outputText}</p>}
          </div>
        </div>
        <Recording
          setTranscription={setTranscription}
          setOutputText={setOutputText}
        />
      </section>
    </>
  );
};
