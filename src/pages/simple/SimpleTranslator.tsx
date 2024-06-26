import { Recording } from "../../components/audio/Recording";
import { useDispatch, useSelector } from "react-redux";
import {
  selectTranslate,
  setOutputText,
  setTranscription,
} from "../../reducer/translateSlice";
import { translateText } from "../../functions/translate/translateText";
import {
  selectLanguage,
  setCurrentLanguage,
} from "../../reducer/languageSlice";
import { useEffect, useState } from "react";
import { PlayAudio } from "../../components/audio/PlayAudio";
import { Loading } from "../../components/Loading";
import { selectStatus, setIsSuccess } from "../../reducer/statusSlice";
import { EditModal } from "../../components/modal/EditModal";
import { createTranslatePlaceholder } from "../../functions/translate/createTranslatePlaceholder";
import styled from "styled-components";
import { selectLogin } from "../../reducer/loginSlice";
import { Navigate } from "react-router";
import { phraseApi } from "../../api/phraseApi";
import { FavoriteButton } from "../../components/favorite/FavoriteButton";

// 入力言語を設定言語に出力するコンポーネント（ホーム）
export const SimpleTranslator = () => {
  const dispatch = useDispatch();
  const { transcription, outputText } = useSelector(selectTranslate);
  const { currentLanguage, isJapanese } = useSelector(selectLanguage);
  const { isLoading, isSuccess } = useSelector(selectStatus);
  const { isLogin } = useSelector(selectLogin);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const successHandlerTranslation = (translatedText: string) => {
    dispatch(setOutputText(translatedText));
    dispatch(setIsSuccess(true));
    if (currentLanguage == "none") {
      dispatch(setCurrentLanguage("en-us"));
    }
  };

  const errorHandlerTranslation = () => {
    dispatch(setOutputText("翻訳に失敗しました"));
    dispatch(setIsSuccess(false));
  };

  // テキストの編集の際に使用するモーダルのサブミットハンドラー
  const modalSubmitHandler = (text: string) => {
    dispatch(setTranscription(text));
    const chosenLanguage =
      currentLanguage === "none" ? "en-us" : currentLanguage;
    const sourcelanguage = isJapanese ? "ja-jp" : chosenLanguage;
    const targetLanguage = isJapanese ? chosenLanguage : "ja-jp";
    translateText(
      text,
      sourcelanguage,
      targetLanguage,
      successHandlerTranslation,
      errorHandlerTranslation
    );
  };

  // プレースホルダーに各言語で「自分の言語で話してください」と設定する
  const placeholder = createTranslatePlaceholder();

  // ドロップダウンで言語変更される度に翻訳しなおす
  useEffect(() => {
    if (transcription === "" || currentLanguage === "none") return;
    const sourceLanguage = isJapanese ? "ja-jp" : currentLanguage;
    const targetLanguage = isJapanese ? currentLanguage : "ja-jp";
    translateText(
      transcription,
      sourceLanguage,
      targetLanguage,
      successHandlerTranslation,
      errorHandlerTranslation
    );
  }, [currentLanguage]);

  // 日本語がお気に入りに登録されているか
  useEffect(() => {
    if (outputText === "") return;
    const text = isJapanese ? transcription : outputText;
    phraseApi
      .checkExist(text)
      .then((res) => {
        if (res.data.length != 0) {
          setIsFavorite(true);
        } else {
          setIsFavorite(false);
        }
      })
      .catch((err) => alert(err.data));
  }, [outputText]);

  return isLogin ? (
    <StyledSimpleTranslator className="container">
      <div className="content-area">
        <div>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {transcription && isSuccess && (
                <FavoriteButton
                  setIsFavorite={setIsFavorite}
                  isFavorite={isFavorite}
                  phraseTitle={isJapanese ? transcription : outputText}
                />
              )}

              <p
                onClick={() => {
                  if (!isSuccess) return;
                  setModalIsOpen(true);
                }}
                className={transcription ? "" : "placeholder"}
              >
                {transcription ? transcription : placeholder}
              </p>
              {outputText && (
                <>
                  <p>{outputText}</p>
                  {/* PlayAudioボタンを押すとoutputTextの内容が設定言語で再生される */}
                  <PlayAudio text={outputText} />
                </>
              )}
            </>
          )}
        </div>
      </div>
      <Recording />
      <EditModal
        title="入力内容を編集"
        defaultValue={transcription}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        submitHandler={modalSubmitHandler}
      />
    </StyledSimpleTranslator>
  ) : (
    <Navigate to="/login" />
  );
};

const StyledSimpleTranslator = styled.section`
  & .content-area {
    & > div {
      position: relative;
    }

    & .placeholder {
      height: 100%;
      color: #777;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
  & textarea {
    text-align: center;
    overflow: scroll;
    resize: none;
    width: 100%;
    height: 50%;
    &::-webkit-scrollbar {
      display: none;
    }
    &.placeholder {
      height: 100%;
      color: #777;
    }
  }

  & p {
    text-align: center;
  }
`;
