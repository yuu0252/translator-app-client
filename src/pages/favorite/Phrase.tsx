import { useEffect, useState } from 'react';
import { TypePhrase } from '../../type';
import {
  selectLanguage,
  setCurrentLanguage,
} from '../../reducer/languageSlice';
import { translateText } from '../../functions/translate/translateText';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import { SlArrowDown } from 'react-icons/sl';
import { textToSpeech } from '../../functions/audio/textToSpeech';
import { useDispatch, useSelector } from 'react-redux';
import { phraseApi } from '../../api/phraseApi';
import { EditModal } from '../../components/modal/EditModal';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';

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
  const onClickEditPhrase = (phrase: TypePhrase) => {
    setModalIsOpen(true);
    setPhraseId(phrase._id);
    setPhraseTitle(phrase.title);
    setIsNew(false);
  };

  // カテゴリ内の選択されたフレーズを削除
  const onClickDeletePhrase = (phrase: TypePhrase) => {
    phraseApi
      .delete(category._id, phrase._id)
      .then(() => getAllPhrases())
      .catch((err) => alert(err.data));
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
          .catch((err) => alert(err.data))
      : phraseApi
          .update(category._id, phraseId, { title: text })
          .then(() => getAllPhrases())
          .catch((err) => alert(err.data));
  };

  useEffect(() => {
    getAllPhrases();
  }, []);

  return (
    <ul className="phrase-list">
      {phrases.length !== 0 ? (
        phrases.map((phrase: TypePhrase) => (
          <li key={phrase._id}>
            <div className="phrase-text">
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
            </div>
            <div className="button-wrapper">
              <Menu
                className="btn-menu"
                menuButton={
                  <MenuButton>
                    <HiOutlinePencilAlt />
                  </MenuButton>
                }
              >
                <MenuItem onClick={() => onClickEditPhrase(phrase)}>
                  <MenuButton>フレーズを編集</MenuButton>
                </MenuItem>
                <MenuItem>
                  <MenuButton onClick={() => onClickDeletePhrase(phrase)}>
                    フレーズを削除
                  </MenuButton>
                </MenuItem>
              </Menu>
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
