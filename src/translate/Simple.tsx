import { Header } from '../components/Header';
import { Recording } from '../components/Recording';
import { languageCodeList } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectTranslate,
  setOutputText,
  setTranscription,
} from '../reducer/translateSlice';
import { translateText } from '../functions/translate/translateText';
import { selectLanguage } from '../reducer/languageSlice';

export const Simple = () => {
  const dispatch = useDispatch();
  const translate = useSelector(selectTranslate);
  const language = useSelector(selectLanguage);
  const transcription = translate.transcription;
  const outputText = translate.outputText;

  const placeholderList = languageCodeList.map(
    (language) => language.placeholder
  );
  const placeholders = [
    '相手に先に喋ってもらうか(自動検出)、',
    '言語を選んでください(右上)',
    ...placeholderList.filter((str) => str !== undefined),
  ];
  const placeholder = placeholders.join(`\n`);

  const onChangeTextarea = async (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    dispatch(setTranscription(e.target.value));
    const translatedText = await translateText(
      e.target.value,
      language.language,
      language.isJapanese
    );
    dispatch(setOutputText(translatedText));
  };

  return (
    <>
      <Header />
      <section id="simple" className="container">
        <div className="content-area">
          <div>
            <textarea
              value={transcription}
              onChange={onChangeTextarea}
              placeholder={placeholder}
              className={transcription ? '' : 'placeholder'}
            />
            {outputText && <p>{outputText}</p>}
          </div>
        </div>
        <Recording />
      </section>
    </>
  );
};
