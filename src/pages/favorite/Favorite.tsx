import styled from 'styled-components';
import { Header } from '../../components/Header';
import { RiPlayListAddLine } from 'react-icons/ri';
import { EditModal } from '../../components/modal/EditModal';
import { useEffect, useState } from 'react';
import { phraseApi } from '../../api/phraseApi';
import { TypePhrase } from '../../type';
import { PiTrashBold } from 'react-icons/pi';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import { SlArrowDown } from 'react-icons/sl';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectLanguage,
  setCurrentLanguage,
} from '../../reducer/languageSlice';
import { translateText } from '../../functions/translate/translateText';
import { textToSpeech } from '../../functions/audio/textToSpeech';

export const Favorite = () => {
  const [phrases, setPhrases] = useState([]);
  const [phraseTitle, setPhraseTitle] = useState('');
  const [phraseId, setPhraseId] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { currentLanguage } = useSelector(selectLanguage);
  const [openPhraseId, setOpenPhraseId] = useState('');

  const dispatch = useDispatch();

  const successHandler = (text: string) => {
    setTranslatedText(text);
    setIsLoading(false);
  };
  const errorHandler = () => {
    setTranslatedText('翻訳に失敗しました');
    setIsLoading(false);
  };

  const onClickPhrase = async (id: string, phrase: string) => {
    setIsLoading(true);
    if (currentLanguage === 'none') {
      dispatch(setCurrentLanguage('en-us'));
    }
    if (openPhraseId === id) {
      setTranslatedText('');
      setOpenPhraseId('');
      return;
    }
    setOpenPhraseId(id);
    const targetLanguage =
      currentLanguage === 'none' ? 'en-us' : currentLanguage;
    await translateText(
      phrase,
      'ja-jp',
      targetLanguage,
      successHandler,
      errorHandler
    );
  };

  const getAllPhrases = () => {
    phraseApi
      .getAll()
      .then((res) => {
        setPhrases(res.data.reverse());
      })
      .catch(() => alert('お気に入りフレーズの取得に失敗しました'));
  };

  const modalSubmitHandler = (text: string) => {
    isNew
      ? // 新しくフレーズを追加する
        phraseApi
          .create(text)
          .then(() => getAllPhrases())
          .catch(() => alert('お気に入りフレーズの作成に失敗しました'))
      : // フレーズを編集する
        phraseApi
          .update(phraseId, { title: text })
          .then(() => getAllPhrases())
          .catch(() => alert('お気に入りフレーズの編集に失敗しました'));
  };

  // ユーザのお気に入りフレーズを取得する
  useEffect(() => {
    getAllPhrases();
  }, []);

  // 言語を変更するたびに翻訳しなおす
  useEffect(() => {
    if (phraseTitle == '') return;
    const translate = async () => {
      console.log(currentLanguage, phraseTitle);
      await translateText(
        phraseTitle,
        'ja-jp',
        currentLanguage,
        successHandler,
        errorHandler
      );
    };
    translate();
  }, [currentLanguage]);

  // フレーズを削除
  const onClickDelete = (phraseId: string) => {
    phraseApi
      .delete(phraseId)
      .then(() => getAllPhrases())
      .catch(() => alert('フレーズの削除に失敗しました'));
  };

  const onClickAddButton = () => {
    setPhraseTitle('');
    setPhraseId('');
    setIsNew(true);
    setModalIsOpen(true);
  };

  const onClickEditButton = (phrase: TypePhrase) => {
    setModalIsOpen(true);
    setPhraseId(phrase._id);
    setPhraseTitle(phrase.title);
    setIsNew(false);
  };

  return (
    <>
      <Header />
      <StyledFavorite id="favorite" className="container">
        <div className="content-area">
          <div>
            <div className="list-wrapper">
              <div className="list-title">
                <h2>お気に入りフレーズ</h2>
                <button className="add-btn" onClick={onClickAddButton}>
                  <RiPlayListAddLine />
                  <span>追加</span>
                </button>
              </div>

              {phrases.length !== 0 ? (
                <ul>
                  {phrases.map((phrase: TypePhrase) => (
                    <li key={phrase._id}>
                      <p
                        onClick={() => onClickPhrase(phrase._id, phrase.title)}
                      >
                        {phrase.title}
                      </p>
                      {openPhraseId === phrase._id &&
                        (isLoading ? (
                          <div>
                            <SlArrowDown />
                            <p>翻訳中...</p>
                          </div>
                        ) : (
                          <div>
                            <SlArrowDown />
                            <p
                              onClick={() =>
                                textToSpeech(translatedText, currentLanguage)
                              }
                            >
                              {translatedText}
                            </p>
                          </div>
                        ))}
                      <div className="button-wrapper">
                        <button onClick={() => onClickEditButton(phrase)}>
                          <HiOutlinePencilAlt />
                        </button>
                        <button
                          className="caution"
                          onClick={() => {
                            onClickDelete(phrase._id);
                          }}
                        >
                          <PiTrashBold />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>まだお気に入りフレーズはありません</p>
              )}
            </div>
          </div>
        </div>
      </StyledFavorite>
      <EditModal
        defaultValue={phraseTitle}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        submitHandler={modalSubmitHandler}
      />
    </>
  );
};

const StyledFavorite = styled.section`
  height: auto;

  & .list-wrapper {
    width: 80%;
    text-align: center;

    & > p {
      font-size: 16px;
      margin: 30px 0;
    }

    & .list-title {
      display: grid;
      grid-template-columns: 10% 80% 10%;
      margin-bottom: 30px;
      & h2 {
        grid-column: 2/3;
        font-size: 20px;
        vertical-align: middle;
      }
      & .add-btn {
        grid-column: 3/4;
        display: flex;
        width: 60px;
        font-size: 16px;
        align-items: center;
        padding: 0;
        column-gap: 5px;

        & span {
          white-space: nowrap;
        }
      }
    }

    & ul {
      & li {
        display: grid;
        grid-template-columns: 10% 80% 10%;
        font-weight: normal;
        padding: 5px 0;
        margin-top: 5px;
        font-size: 16px;
        border-bottom: dashed #555 1px;
        cursor: pointer;
        &:last-of-type {
          margin-bottom: 30px;
        }

        & > p,
        & > div {
          grid-column: 2/3;
        }

        & .button-wrapper {
          display: flex;
          align-items: center;
          width: 100%;
          height: 100%;
          min-width: 50px;
          grid-column: 3/4;
          grid-row: 1/3;
          margin: 0 0 auto;
          color: #555;

          & > button {
            display: flex;
            width: 100%;
          }

          & .caution {
            color: #ff0000;
          }
        }
      }
    }
  }
`;
