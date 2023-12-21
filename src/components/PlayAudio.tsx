import { HiSpeakerWave } from 'react-icons/hi2';
import { textToSpeech } from '../functions/audio/textToSpeech';

type Props = {
  text: string;
  language: {
    languageCode: string;
    isJapanese: boolean;
  };
};

export const PlayAudio = ({ text, language }: Props) => {
  const languageCode = language.isJapanese ? language.languageCode : 'ja';
  const speaker = 
  const onClickPlay = () => {
    textToSpeech(text, languageCode, speaker);
  };

  return (
    <button onClick={onClickPlay} className="speaker-btn">
      <HiSpeakerWave />
    </button>
  );
};
