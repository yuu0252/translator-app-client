import Modal from 'react-modal';
import { useRef } from 'react';
import { styleEditModal } from '../../constants';
import { AiFillCloseSquare } from 'react-icons/ai';

type Props = {
  defaultValue?: string;
  modalIsOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  submitHandler: (text: string) => void;
};

// テキストを編集するためのモーダル
export const EditModal = ({
  defaultValue,
  modalIsOpen,
  setModalIsOpen,
  submitHandler,
}: Props) => {
  const textareaElement = useRef<HTMLTextAreaElement>(null);

  const onClickModalSubmit = (text?: string) => {
    if (!text || text.replace(/\r?\n/g, '') === '') {
      alert('テキストを入力してください');
      return;
    }
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
        <textarea defaultValue={defaultValue} ref={textareaElement} />
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
