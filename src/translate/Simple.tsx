import { Header } from "../components/Header";
import { Recording } from "../components/Recording";
import { languageCodeList } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import {
  selectTranslate,
  setOutputText,
  setTranscription,
} from "../reducer/translateSlice";
import { translateText } from "../functions/translate/translateText";
import { selectLanguage } from "../reducer/languageSlice";

import Modal from "react-modal";
import { useEffect, useRef, useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";
import { PlayAudio } from "../components/PlayAudio";

export const Simple = () => {
  const dispatch = useDispatch();
  const translate = useSelector(selectTranslate);
  const language = useSelector(selectLanguage);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const textareaElement = useRef<HTMLTextAreaElement>(null);
  const customStyles = {
    content: {
      width: "80%",
      height: "50%",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      borderRadius: "10px",
      transform: "translate(-50%, -50%)",
    },
    overlay: {
      backgroundColor: "rgba(0,0,0,0.5)",
    },
  };

  const transcription = translate.transcription;
  const outputText = translate.outputText;

  const placeholderList = languageCodeList.map(
    (language) => language.placeholder
  );
  const placeholders = [
    "相手に先に喋ってもらうか(自動検出)、",
    "言語を選んでください(右上)",
    ...placeholderList.filter((str) => str !== undefined),
  ];
  const placeholder = placeholders.join(`\n`);

  useEffect(() => {
    const fetchApi = async () => {
      const text = await translateText(
        transcription,
        language.language,
        language.isJapanese
      );
      dispatch(setOutputText(text));
    };
    fetchApi();
  }, [language.language]);

  const onClickModalSubmit = async (text?: string) => {
    if (!text) return;
    setModalIsOpen(false);
    dispatch(setTranscription(text));
    const translatedText = await translateText(
      text,
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
            <p
              onClick={() => setModalIsOpen(true)}
              className={transcription ? "" : "placeholder"}
            >
              {transcription ? transcription : placeholder}
            </p>
            {outputText && (
              <>
                <p>{outputText}</p>
                <PlayAudio text={outputText} language={language} />
              </>
            )}
          </div>
        </div>
        <Recording />
        <Modal
          isOpen={modalIsOpen}
          style={customStyles}
          onRequestClose={() => setModalIsOpen(false)}
          contentLabel="Modal"
          ariaHideApp={false}
        >
          <button className="close-btn" onClick={() => setModalIsOpen(false)}>
            <AiFillCloseSquare />
          </button>
          <div>
            <h2>入力内容を編集</h2>
            <textarea defaultValue={transcription} ref={textareaElement} />
          </div>
          <button
            className="submit-btn"
            onClick={() => onClickModalSubmit(textareaElement.current?.value)}
          >
            決定
          </button>
        </Modal>
      </section>
    </>
  );
};
