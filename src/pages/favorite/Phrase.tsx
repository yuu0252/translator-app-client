import { useEffect, useState } from "react";
import { TypeCategory, TypePhrase } from "../../type";
import {
  selectLanguage,
  setCurrentLanguage,
} from "../../reducer/languageSlice";
import { translateText } from "../../functions/translate/translateText";
import { PiTrashBold } from "react-icons/pi";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { SlArrowDown } from "react-icons/sl";
import { textToSpeech } from "../../functions/audio/textToSpeech";
import { useDispatch, useSelector } from "react-redux";
import { phraseApi } from "../../api/phraseApi";
import { RiPlayListAddLine } from "react-icons/ri";

export const Phrase = ({
  category,
  getAllCategories,
}: {
  category: TypeCategory;
  getAllCategories: () => void;
}) => {
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openPhraseId, setOpenPhraseId] = useState("");
  const [phraseTitle, setPhraseTitle] = useState("");
  const [phraseId, setPhraseId] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isNew, setIsNew] = useState(true);

  const { currentLanguage } = useSelector(selectLanguage);
  const dispatch = useDispatch();

  const successHandler = (text: string) => {
    setTranslatedText(text);
    setIsLoading(false);
  };
  const errorHandler = () => {
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
      successHandler,
      errorHandler
    );
  };

  const onClickEditButton = (phrase: TypePhrase) => {
    setModalIsOpen(true);
    setPhraseId(phrase._id);
    setPhraseTitle(phrase.title);
    setIsNew(false);
  };

  // フレーズを削除
  const onClickDelete = (phraseId: string) => {
    phraseApi
      .delete(phraseId)
      .then(() => getAllCategories())
      .catch(() => alert("フレーズの削除に失敗しました"));
  };

  // 言語を変更するたびに翻訳しなおす
  useEffect(() => {
    if (openPhraseId == "") return;
    const translate = async () => {
      await translateText(
        phraseTitle,
        "ja-jp",
        currentLanguage,
        successHandler,
        errorHandler
      );
    };
    translate();
  }, [currentLanguage]);

  return category.phrases.length !== 0 ? (
    <ul className="phrase-list">
      {category.phrases.map((phrase) => (
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
                  onClick={() => textToSpeech(translatedText, currentLanguage)}
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
    <p className="caution-text">フレーズがありません</p>
  );
};
