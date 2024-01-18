import { HiSpeakerWave } from 'react-icons/hi2';
import { textToSpeech } from '../functions/audio/textToSpeech';
import { languageCodeList } from '../constants';

type Props = {
  text: string;
  language: {
    language: string;
    isJapanese: boolean;
  };
};

export const PlayAudio = ({ text, language }: Props) => {
  const speak = languageCodeList.find(
    (e) => e.code === language.language
  )?.speak;
  const languageCode = language.isJapanese ? speak?.code : 'ja-JP';
  const onClickPlay = () => {
    if (!languageCode) return;
    textToSpeech(text, languageCode);
  };

  return (
    <button onClick={onClickPlay} className="speaker-btn">
      <HiSpeakerWave />
    </button>
  );
};
