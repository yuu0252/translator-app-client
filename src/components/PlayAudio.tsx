import { HiSpeakerWave } from 'react-icons/hi2';
import { textToSpeech } from '../functions/audio/textToSpeech';
import { languageCodeList } from '../constants';
import { useSelector } from 'react-redux';
import { selectLanguage } from '../reducer/languageSlice';

export const PlayAudio = ({ text }: { text: string }) => {
  const { currentLanguage, isJapanese } = useSelector(selectLanguage);
  const speak = languageCodeList.find((e) => e.code === currentLanguage)?.speak;
  const languageCode = isJapanese ? speak?.code : 'ja-JP';
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
