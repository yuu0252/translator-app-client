import { useState } from 'react';
import { Header } from '../components/Header';
import { RecordingIos } from '../components/RecordingIos';

export const Simple = () => {
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

  return (
    <>
      <Header />
      <section id="simple">
        <div className="textarea">
          <div className={transcription === placeholder ? 'placeholder' : ''}>
            <p>{transcription}</p>
            {outputText && <p>{outputText}</p>}
          </div>
        </div>
        <RecordingIos
          setTranscription={setTranscription}
          setOutputText={setOutputText}
        />
      </section>
    </>
  );
};
