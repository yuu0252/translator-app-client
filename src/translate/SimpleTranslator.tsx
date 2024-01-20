import { Header } from '../components/Header';
import { Recording } from '../components/Recording';
import { languageCodeList } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import { selectTranslate, setOutputText } from '../reducer/translateSlice';
import { translateText } from '../functions/translate/translateText';
import { selectLanguage } from '../reducer/languageSlice';
import { useEffect, useState } from 'react';
import { PlayAudio } from '../components/PlayAudio';
import { Loading } from '../components/Loading';
import { selectLoading } from '../reducer/loadingSlice';
import { EditModal } from '../components/EditModal';
import styled from 'styled-components';

export const SimpleTranslator = () => {
  const dispatch = useDispatch();
  const translate = useSelector(selectTranslate);
  const language = useSelector(selectLanguage);
  const loading = useSelector(selectLoading);
  const [modalIsOpen, setModalIsOpen] = useState(false);

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

  useEffect(() => {
    async () => {
      const source = languageCodeList.find(
        (e) => e.code === language.language
      )?.query;
      if (!source) return;
      const text = await translateText(
        transcription,
        source,
        language.isJapanese
      );
      dispatch(setOutputText(text));
    };
  }, [language.language]);

  return (
    <>
      <Header />
      <StyledSimpleTranslator className="container">
        <div className="content-area">
          <div>
            {loading.isLoading ? (
              <Loading />
            ) : (
              <>
                <p
                  onClick={() => setModalIsOpen(true)}
                  className={transcription ? '' : 'placeholder'}
                >
                  {transcription ? transcription : placeholder}
                </p>
                {outputText && (
                  <>
                    <p>{outputText}</p>
                    <PlayAudio text={outputText} language={language} />
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <Recording />
        <EditModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} />
      </StyledSimpleTranslator>
    </>
  );
};

const StyledSimpleTranslator = styled.section`
  & .content-area {
    & > div {
      position: relative;
    }
    & .placeholder {
      height: 100%;
      color: #777;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
  & textarea {
    text-align: center;
    overflow: scroll;
    resize: none;
    width: 100%;
    height: 50%;
    &::-webkit-scrollbar {
      display: none;
    }
    &.placeholder {
      height: 100%;
      color: #777;
    }
  }

  & p {
    text-align: center;
  }
`;
