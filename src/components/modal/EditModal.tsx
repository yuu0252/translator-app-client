import { useDispatch, useSelector } from 'react-redux';
import {
  selectTranslate,
  setOutputText,
  setTranscription,
} from '../../reducer/translateSlice';
import { translateText } from '../../functions/translate/translateText';
import { selectLanguage } from '../../reducer/languageSlice';
import Modal from 'react-modal';
import { useRef } from 'react';
import { AiFillCloseSquare } from 'react-icons/ai';
import store from '../../reducer/store';
import { styleEditModal } from '../../constants';

type Props = {
  modalIsOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  submitHandler: (text: string) => void;
};

// 音声認識後のテキストを編集するためのモーダル
export const EditModal = ({
  modalIsOpen,
  setModalIsOpen,
  submitHandler,
}: Props) => {
  const textareaElement = useRef<HTMLTextAreaElement>(null);
  const transcription = useSelector(selectTranslate).transcription;

  const onClickModalSubmit = (text?: string) => {
    if (!text) return;
    setModalIsOpen(false);
    submitHandler(text);
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      style={styleEditModal}
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
