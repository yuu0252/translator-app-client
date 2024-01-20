import { languageCodeList } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectTranslate,
  setOutputText,
  setTranscription,
} from '../reducer/translateSlice';
import { translateText } from '../functions/translate/translateText';
import { selectLanguage } from '../reducer/languageSlice';

import Modal from 'react-modal';
import { useRef } from 'react';
import { AiFillCloseSquare } from 'react-icons/ai';

type Props = {
  modalIsOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const customStyles = {
  content: {
    width: '80%',
    height: '50%',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    borderRadius: '10px',
    transform: 'translate(-50%, -50%)',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
};

export const EditModal = ({ modalIsOpen, setModalIsOpen }: Props) => {
  const dispatch = useDispatch();
  const language = useSelector(selectLanguage);
  const textareaElement = useRef<HTMLTextAreaElement>(null);
  const transcription = useSelector(selectTranslate).transcription;

  const onClickModalSubmit = async (text?: string) => {
    if (!text) return;
    setModalIsOpen(false);
    dispatch(setTranscription(text));
    const source = languageCodeList.find(
      (e) => e.code === language.language
    )?.query;
    if (!source) return;
    const translatedText = await translateText(
      text,
      source,
      language.isJapanese
    );
    dispatch(setOutputText(translatedText));
  };

  return (
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
  );
};
