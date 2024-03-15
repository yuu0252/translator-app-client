import { useRef } from "react";
import { AiFillCloseSquare } from "react-icons/ai";
import { createPortal } from "react-dom";
import styled from "styled-components";

type Props = {
  title: string;
  defaultValue?: string;
  modalIsOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  submitHandler: (text: string) => void;
};

// テキストを編集するためのモーダル
export const EditModal = ({
  title,
  defaultValue,
  modalIsOpen,
  setModalIsOpen,
  submitHandler,
}: Props) => {
  const textareaElement = useRef<HTMLTextAreaElement>(null);

  const onClickModalSubmit = (text?: string) => {
    if (!text || text.replace(/\r?\n/g, "") === "") {
      alert("テキストを入力してください");
      return;
    }
    setModalIsOpen(false);
    submitHandler(text);
  };

  return (
    <>
      {modalIsOpen &&
        createPortal(
          <StyledEditModal
            onClick={() => {
              setModalIsOpen(false);
            }}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <div>
                <button
                  className="close-btn"
                  onClick={() => setModalIsOpen(false)}
                >
                  <AiFillCloseSquare />
                </button>
                <div>
                  <h2>{title}</h2>
                  <textarea defaultValue={defaultValue} ref={textareaElement} />
                </div>
                <button
                  className="submit-btn"
                  onClick={() =>
                    onClickModalSubmit(textareaElement.current?.value)
                  }
                >
                  決定
                </button>
              </div>
            </div>
          </StyledEditModal>,
          document.body
        )}
    </>
  );
};

const StyledEditModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  & > div {
    padding: 30px;
    position: absolute;
    width: 80%;
    maxwidth: 800px;
    height: 60%;
    top: 50%;
    left: 50%;
    right: auto;
    bottom: auto;
    border-radius: 10px;
    background-color: #fff;
    transform: translate(-50%, -50%);

    & > div {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 0 10px 10px rgba(#333, 0.2);
      border: dashed 3px #555;
      border-radius: 10px;
      padding: 15px 30px;
      & > div {
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 30px;
        width: 100%;
        height: 80%;

        & textarea {
          resize: none;
          width: 80%;
          height: 50%;
          border: 2px solid #777;
          border-radius: 5px;
          padding: 15px;
          text-align: center;
        }
      }

      & .close-btn {
        width: 30px;
        height: 30px;
        padding: 0;
        border-radius: 0;
        margin: 0 0 0 auto;
        & > svg {
          color: #000;
        }
      }

      & .submit-btn {
        width: auto;
        height: auto;
        color: #fff;
        border-radius: 5px;
        background-color: #333;
        padding: 10px 30px;
      }
    }
  }
`;
