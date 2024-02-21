import styled from 'styled-components';
import { Header } from '../../components/Header';
import { RiPlayListAddLine } from 'react-icons/ri';
import { EditModal } from '../../components/modal/EditModal';
import { useEffect, useState } from 'react';
import { phraseApi } from '../../api/phraseApi';
import { TypePhrase } from '../../type';
import { PiTrashBold } from 'react-icons/pi';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { selectLanguage } from '../../reducer/languageSlice';
import { translateText } from '../../functions/translate/translateText';
import { textToSpeech } from '../../functions/audio/textToSpeech';

export const Favorite = () => {
  const [phrases, setPhrases] = useState([]);
  const [phraseTitle, setPhraseTitle] = useState('');
  const [phraseId, setPhraseId] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [translatedText, setTranslatedText] = useState('');
  const { currentLanguage } = useSelector(selectLanguage);

  const onClickPhrase = async (id: string, phrase: string) => {
    if (phraseId === id) {
      setTranslatedText('');
      setPhraseId('');
      return;
    }
    setPhraseId(id);
    const targetLanguage =
      currentLanguage === 'none' ? 'en-us' : currentLanguage;
    const successHandler = (text: string) => {
      setTranslatedText(text);
    };
    const errorHandler = () => {
      setTranslatedText('翻訳に失敗しました');
    };
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
    // 新しくフレーズを追加する
    isNew
      ? phraseApi
          .create(text)
          .then(() => getAllPhrases())
          .catch(() => alert('お気に入りフレーズの作成に失敗しました'))
      : phraseApi
          .update(phraseId, { title: text })
          .then(() => getAllPhrases())
          .catch(() => alert('お気に入りフレーズの編集に失敗しました'));
  };

  // ユーザのお気に入りフレーズを取得する
  useEffect(() => {
    getAllPhrases();
  }, []);

  // フレーズを削除
  const onClickDelete = (phraseId: string) => {
    phraseApi
      .delete(phraseId)
      .then(() => getAllPhrases())
      .catch(() => alert('フレーズの削除に失敗しました'));
  };

  console.log(translatedText, phraseId);

  return (
    <>
      <Header />
      <StyledFavorite id="favorite" className="container">
        <div className="content-area">
          <div>
            <div className="list-wrapper">
              <div className="list-title">
                <h2>お気に入りフレーズ</h2>
                <button
                  className="add-btn"
                  onClick={() => {
                    setPhraseTitle('');
                    setPhraseId('');
                    setIsNew(true);
                    setModalIsOpen(true);
                  }}
                >
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
                      {translatedText !== '' && phraseId === phrase._id && (
                        <p
                          onClick={() =>
                            textToSpeech(translatedText, currentLanguage)
                          }
                        >
                          {translatedText}
                        </p>
                      )}
                      <div className="button-wrapper">
                        <button
                          onClick={() => {
                            setModalIsOpen(true);
                            setPhraseId(phrase._id);
                            setPhraseTitle(phrase.title);
                            setIsNew(false);
                          }}
                        >
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
        width: 100%;
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

        & > p {
          grid-column: 2/3;
        }

        & .button-wrapper {
          display: flex;
          width: 100%;
          min-width: 50px;
          grid-column: 3/4;
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
