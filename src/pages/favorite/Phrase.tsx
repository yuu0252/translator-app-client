import { useEffect, useState } from "react";
import { TypeCategory, TypePhrase } from "../../type";
import {
  selectLanguage,
  setCurrentLanguage,
} from "../../reducer/languageSlice";
import { translateText } from "../../functions/translate/translateText";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { SlArrowDown } from "react-icons/sl";
import { textToSpeech } from "../../functions/audio/textToSpeech";
import { useDispatch, useSelector } from "react-redux";
import { phraseApi } from "../../api/phraseApi";
import { EditModal } from "../../components/modal/EditModal";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";

export const Phrase = ({
  category,
  phrase,
  getAllPhrases,
}: {
  category: TypeCategory;
  phrase: TypePhrase;
  getAllPhrases: (category: TypeCategory) => void;
}) => {
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openPhraseId, setOpenPhraseId] = useState("");
  const [phraseTitle, setPhraseTitle] = useState("");
  const [phraseId, setPhraseId] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { currentLanguage } = useSelector(selectLanguage);
  const dispatch = useDispatch();

  const translationSuccessHandler = (text: string) => {
    setTranslatedText(text);
    setIsLoading(false);
  };
  const translationErrorHandler = () => {
    setTranslatedText("翻訳に失敗しました");
    setIsLoading(false);
  };

  const onClickPhrase = async (id: string, phrase: string) => {
    setPhraseTitle(phrase);
    setIsLoading(true);
    if (currentLanguage === "none") {
      dispatch(setCurrentLanguage("en-us"));
    }
    if (openPhraseId === id) {
      setTranslatedText("");
      setOpenPhraseId("");
      return;
    }
    setOpenPhraseId(id);
    const targetLanguage =
      currentLanguage === "none" ? "en-us" : currentLanguage;
    await translateText(
      phrase,
      "ja-jp",
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
  };

  // カテゴリ内の選択されたフレーズを削除
  const onClickDeletePhrase = (phrase: TypePhrase) => {
    phraseApi
      .delete(category._id, phrase._id)
      .then(() => getAllPhrases(category))
      .catch((err) => alert(err.data));
  };

  // 言語を変更するたびに翻訳しなおす
  useEffect(() => {
    if (openPhraseId == "") return;
    const translate = async () => {
      await translateText(
        phraseTitle,
        "ja-jp",
        currentLanguage,
        translationSuccessHandler,
        translationErrorHandler
      );
    };
    translate();
  }, [currentLanguage]);

  const modalSubmitHandler = (text: string) => {
    // ボタンの押されたカテゴリのフレーズを更新する
    phraseApi
      .update(category._id, phraseId, { title: text })
      .then(() => getAllPhrases(category))
      .catch((err) => alert(err.data));
  };

  return (
    <>
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
              <p onClick={() => textToSpeech(translatedText, currentLanguage)}>
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

      <EditModal
        title="フレーズを編集"
        defaultValue={phraseTitle}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        submitHandler={modalSubmitHandler}
      />
    </>
  );
};
