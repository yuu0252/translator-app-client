import { useState } from 'react';

import { useReactMediaRecorder } from 'react-media-recorder-2';

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
  const [outputText, setOutputText] = useState(placeholder);

  useReactMediaRecorder({ audio: true });

  return (
    <section id="simple">
      <div className="select-box">
        <select>
          <option key="default">言語を選択</option>
          {Object.entries(languageList).map(([key, value]) => (
            <option key={key}>{`${key}(${value})`}</option>
          ))}
        </select>
      </div>
      <div className="textarea">
        <p className={outputText === placeholder ? 'placeholder' : ''}>
          <span>{outputText}</span>
        </p>
      </div>
    </section>
  );
};
