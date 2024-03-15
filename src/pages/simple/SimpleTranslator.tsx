import { Header } from '../../components/Header';
import { Recording } from '../../components/audio/Recording';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectTranslate,
  setOutputText,
  setTranscription,
} from '../../reducer/translateSlice';
import { translateText } from '../../functions/translate/translateText';
import { selectLanguage } from '../../reducer/languageSlice';
import { useEffect, useState } from 'react';
import { PlayAudio } from '../../components/audio/PlayAudio';
import { Loading } from '../../components/Loading';
import { selectLoading } from '../../reducer/loadingSlice';
import { EditModal } from '../../components/modal/EditModal';
import { createTranslatePlaceholder } from '../../functions/translate/createTranslatePlaceholder';
import styled from 'styled-components';
import { selectLogin } from '../../reducer/loginSlice';
import { Navigate } from 'react-router';
import { BiBookmarkPlus } from 'react-icons/bi';
import { BiSolidBookmarkPlus } from 'react-icons/bi';
import { phraseApi } from '../../api/phraseApi';
import { Menu, MenuButton, MenuItem, SubMenu } from '@szhsin/react-menu';

export const SimpleTranslator = () => {
  const dispatch = useDispatch();
  const translate = useSelector(selectTranslate);
  const { currentLanguage, isJapanese } = useSelector(selectLanguage);
  const { isLoading } = useSelector(selectLoading);
  const { isLogin } = useSelector(selectLogin);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [favoritePhraseId, setFavoritePhraseId] = useState<string | null>(null);
  const transcription = translate.transcription;
  const outputText = translate.outputText;

  const successHandlerTranslation = (translatedText: string) => {
    dispatch(setOutputText(translatedText));
  };

  const errorHandlerTranslation = () => {
    dispatch(setOutputText('翻訳に失敗しました'));
  };

  const modalSubmitHandler = (text: string) => {
    dispatch(setTranscription(text));
    const chosenLanguage =
      currentLanguage === 'none' ? 'en-us' : currentLanguage;
    const sourcelanguage = isJapanese ? 'ja-jp' : chosenLanguage;
    const targetLanguage = isJapanese ? chosenLanguage : 'ja-jp';
    translateText(
      text,
      sourcelanguage,
      targetLanguage,
      successHandlerTranslation,
      errorHandlerTranslation
    );
  };

  // // お気に入りボタンが押されたら日本語の文を登録
  // const onClickFavorite = () => {
  //   const text = isJapanese ? transcription : outputText;
  //   phraseApi
  //     .create(text)
  //     .then((res) => setFavoritePhraseId(res.data._id))
  //     .catch(() => alert('お気に入りフレーズの作成に失敗しました'));
  // };

  // // お気に入りボタンが登録状態で押されたらフレーズを削除
  // const onClickDeleteFavorite = () => {
  //   if (!favoritePhraseId) return;
  //   phraseApi
  //     .delete(favoritePhraseId)
  //     .then(() => setFavoritePhraseId(null))
  //     .catch(() => alert('お気に入り解除に失敗しました'));
  // };

  // プレースホルダーに各言語で「自分の言語で話してください」と設定する
  const placeholder = createTranslatePlaceholder();

  // ドロップダウンで言語変更される度に翻訳しなおす
  useEffect(() => {
    if (transcription === '' || currentLanguage === 'none') return;
    const sourceLanguage = isJapanese ? 'ja-jp' : currentLanguage;
    const targetLanguage = isJapanese ? currentLanguage : 'ja-jp';
    translateText(
      transcription,
      sourceLanguage,
      targetLanguage,
      successHandlerTranslation,
      errorHandlerTranslation
    );
  }, [currentLanguage]);

  // 日本語がお気に入りに登録されているか
  useEffect(() => {
    if (outputText === '') return;
    const text = isJapanese ? transcription : outputText;
    phraseApi
      .getOne(text)
      .then((res) => {
        if (res.data) {
          setFavoritePhraseId(res.data._id);
        } else {
          setFavoritePhraseId(null);
        }
      })
      .catch((err) => alert(err.data));
  }, [outputText]);

  return isLogin ? (
    <>
      <Header />
      <StyledSimpleTranslator className="container">
        <div className="content-area">
          <div>
            {isLoading ? (
              <Loading />
            ) : (
              <>
                {
                  transcription && (
                    <Menu menuButton={<MenuButton>Open menu</MenuButton>}>
                      <MenuItem>New File</MenuItem>
                      <MenuItem>Save</MenuItem>
                      <SubMenu label="Edit">
                        <MenuItem>Cut</MenuItem>
                        <MenuItem>Copy</MenuItem>
                        <MenuItem>Paste</MenuItem>
                      </SubMenu>
                      <MenuItem>Print...</MenuItem>
                    </Menu>
                  )
                  // (favoritePhraseId ? (
                  //   <button
                  //     className="favorite-btn"
                  //     onClick={() => onClickDeleteFavorite()}
                  //   >
                  //     <BiSolidBookmarkPlus />
                  //   </button>
                  // ) : (
                  //   <button
                  //     className="favorite-btn"
                  //     onClick={() => onClickFavorite()}
                  //   >
                  //     <BiBookmarkPlus />
                  //   </button>
                }
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
        <EditModal
          title="入力内容を編集"
          defaultValue={transcription}
          modalIsOpen={modalIsOpen}
          setModalIsOpen={setModalIsOpen}
          submitHandler={modalSubmitHandler}
        />
      </StyledSimpleTranslator>
    </>
  ) : (
    <Navigate to="/login" />
  );
};

const StyledSimpleTranslator = styled.section`
  & .content-area {
    & > div {
      position: relative;

      & > .favorite-btn {
        position: absolute;
        top: 15px;
        right: 15px;
        width: 40px;
        height: 40px;
      }
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
