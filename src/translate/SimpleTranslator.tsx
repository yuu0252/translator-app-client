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
import { createTranslatePlaceholder } from '../functions/translate/createTranslatePlaceholder';
import styled from 'styled-components';

export const SimpleTranslator = () => {
  const dispatch = useDispatch();
  const translate = useSelector(selectTranslate);
  const { currentLanguage, isJapanese } = useSelector(selectLanguage);
  const loading = useSelector(selectLoading);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const transcription = translate.transcription;
  const outputText = translate.outputText;

  const isLoading = loading.isLoading;

  // プレースホルダーに各言語で「自分の言語で話してください」と設定する
  const placeholder = createTranslatePlaceholder();

  // ドロップダウンで言語変更される度に翻訳しなおす
  useEffect(() => {
    async () => {
      const source = languageCodeList.find(
        (e) => e.code === currentLanguage
      )?.shortCode;
      if (!source) return;
      const text = await translateText(transcription, source, isJapanese);
      dispatch(setOutputText(text));
    };
  }, [currentLanguage]);

  return (
    <>
      <Header />
      <StyledSimpleTranslator className="container">
        <div className="content-area">
          <div>
            {isLoading ? (
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
                    {/* PlayAudioボタンを押すとoutputTextの内容が設定言語で再生される */}
                    <PlayAudio text={outputText} />
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
