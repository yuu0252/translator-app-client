import { useEffect, useState } from 'react';
import { TypePhrase } from '../../type';
import {
  selectLanguage,
  setCurrentLanguage,
} from '../../reducer/languageSlice';
import { translateText } from '../../functions/translate/translateText';
import { PiTrashBold } from 'react-icons/pi';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import { SlArrowDown } from 'react-icons/sl';
import { textToSpeech } from '../../functions/audio/textToSpeech';
import { useDispatch, useSelector } from 'react-redux';
import { phraseApi } from '../../api/phraseApi';
import { EditModal } from '../../components/modal/EditModal';

export const Phrase = ({ category }: { category: TypePhrase }) => {
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openPhraseId, setOpenPhraseId] = useState('');
  const [phraseTitle, setPhraseTitle] = useState('');
  const [phrases, setPhrases] = useState([]);
  const [phraseId, setPhraseId] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isNew, setIsNew] = useState(true);

  const { currentLanguage } = useSelector(selectLanguage);
  const dispatch = useDispatch();

  const getAllPhrases = () => {
    phraseApi
      .getAll(category._id)
      .then((res) => {
        setPhrases(res.data.reverse());
      })
      .catch(() => {
        alert(`カテゴリ:${category.title}のフレーズ取得に失敗しました`);
      });
  };

  const translationSuccessHandler = (text: string) => {
    setTranslatedText(text);
    setIsLoading(false);
  };
  const translationErrorHandler = () => {
    setTranslatedText('翻訳に失敗しました');
    setIsLoading(false);
  };

  const onClickPhrase = async (id: string, phrase: string) => {
    setPhraseTitle(phrase);
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
      translationSuccessHandler,
      translationErrorHandler
    );
  };

  // カテゴリ内の選択されたフレーズを編集
  const onClickEditButton = (phrase: TypePhrase) => {
    setModalIsOpen(true);
    setPhraseId(phrase._id);
    setPhraseTitle(phrase.title);
    setIsNew(false);
  };

  // カテゴリ内の選択されたフレーズを削除
  const onClickDelete = (phraseId: string) => {
    phraseApi
      .delete(category._id, phraseId)
      .then(() => getAllPhrases())
      .catch(() => alert('フレーズの削除に失敗しました'));
  };

  // 言語を変更するたびに翻訳しなおす
  useEffect(() => {
    if (openPhraseId == '') return;
    const translate = async () => {
      await translateText(
        phraseTitle,
        'ja-jp',
        currentLanguage,
        translationSuccessHandler,
        translationErrorHandler
      );
    };
    translate();
  }, [currentLanguage]);

  const modalSubmitHandler = (text: string) => {
    // ボタンの押されたカテゴリにフレーズを追加する
    isNew
      ? phraseApi
          .create(category._id, { title: text })
          .then(() => getAllPhrases())
          .catch(() => alert('フレーズの作成に失敗しました'))
      : phraseApi
          .update(category._id, phraseId, { title: text })
          .then(() => getAllPhrases())
          .catch(() => alert('フレーズの編集に失敗しました'));
  };

  useEffect(() => {
    getAllPhrases();
  }, []);

  return (
    <ul className="phrase-list">
      {phrases.length !== 0 ? (
        phrases.map((phrase: TypePhrase) => (
          <li key={phrase._id}>
            <p onClick={() => onClickPhrase(phrase._id, phrase.title)}>
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
        ))
      ) : (
        <p className="caution-text">フレーズがありません</p>
      )}

      <EditModal
        title={isNew ? 'フレーズを追加' : 'フレーズを編集'}
        defaultValue={phraseTitle}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        submitHandler={modalSubmitHandler}
      />
    </ul>
  );
};
