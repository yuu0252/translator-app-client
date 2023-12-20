import { useState } from 'react';
import { Header } from '../components/Header';
import { Recording } from '../components/Recording';
import { languageCodeList } from '../constants';

export const Simple = () => {
  const placeholderList = languageCodeList.map(
    (language) => language.placeholder
  );
  const placeholders = [
    '相手に先に喋ってもらうか(自動検出)、',
    '言語を選んでください(右上)',
    ...placeholderList.filter((str) => str !== undefined),
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
