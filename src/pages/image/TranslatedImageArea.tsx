import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import styled from "styled-components";
import { AiFillCloseSquare } from "react-icons/ai";
import { translateText } from "../../functions/translate/translateText";
import { useSelector } from "react-redux";
import { selectLanguage } from "../../reducer/languageSlice";
import { textToSpeech } from "../../functions/audio/textToSpeech";
import {
  TypeImageOutputData,
  TypeImageTranslatedData,
  TypeLoadImageResult,
} from "../../type";

// 翻訳された画像とその翻訳後のテキストを重ねて表示する
export const TranslatedImageArea = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [imageWidth, setImageWidth] = useState<number>();
  const [imageHeight, setImageHeight] = useState<number>();
  const imageUrl = location.state.imageUrl;
  const data = location.state.data;
  const isJapanese = location.state.isJapanese;
  const { currentLanguage } = useSelector(selectLanguage);
  const [imageTranslatedData, setImageTranslatedData] =
    useState<Array<TypeImageTranslatedData>>();
  const image = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const imageOutputData: Array<TypeImageOutputData> = [];

    const loadImage = (src: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
      });
    };

    loadImage(imageUrl)
      .then(async (res) => {
        const image = res as TypeLoadImageResult;
        setImageWidth(image.naturalWidth);
        setImageHeight(image.naturalHeight);
        await Promise.all(
          data.map(
            async ({
              text,
              boundingBox,
            }: {
              text: string;
              boundingBox: Array<{ x: number; y: number }>;
            }) => {
              // テキストの表示エリアが適切になるよう調整する
              const width =
                ((boundingBox[1].x - boundingBox[0].x) / image.naturalWidth) *
                  100 +
                10;
              const height =
                ((boundingBox[3].y - boundingBox[1].y) / image.naturalHeight) *
                100;
              const top = (boundingBox[0].y / image.naturalHeight) * 100 + "%";
              const left =
                (boundingBox[0].x / image.naturalWidth) * 100 - 5 + "%";
              const fontSize = "1rem";
              const style = {
                display: "flex",
                position: "absolute",
                width: width + "%",
                minHeight: height + "%",
                top: top,
                left: left,
                backgroundColor: "rgba(0, 0, 0, 0.85)",
                color: "#fff",
                fontSize: fontSize,
                fontWeight: "bold",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                opacity: "0.8",
              };
              let outputText;
              const successHandlerTranslation = (translatedText: string) => {
                outputText = translatedText;
              };
              const errorHandlerTranslation = () => {
                outputText = "翻訳に失敗しました";
              };
              const sourceLanguage = isJapanese ? "ja-jp" : currentLanguage;
              const targetLanguage = isJapanese ? currentLanguage : "ja-jp";
              await translateText(
                text,
                sourceLanguage,
                targetLanguage,
                successHandlerTranslation,
                errorHandlerTranslation
              );
              if (outputText === text || !outputText) return;
              imageOutputData.push({ outputText: outputText, style: style });
            }
          )
        );
        setImageTranslatedData(imageOutputData);
      })
      .catch((err) => console.log(err));
  }, [currentLanguage]);

  return (
    <StyledTranslatedImageArea
      style={{ width: imageWidth, height: imageHeight }}
    >
      {imageTranslatedData &&
        imageTranslatedData.map((e) => (
          <p
            key={e.outputText}
            style={e.style}
            onClick={(e) =>
              isJapanese === true
                ? currentLanguage &&
                  textToSpeech(e.currentTarget.outerText, currentLanguage)
                : currentLanguage &&
                  textToSpeech(e.currentTarget.outerText, "ja-JP")
            }
          >
            {e.outputText}
          </p>
        ))}
      <img src={imageUrl} ref={image} />
      <button className="close-btn" onClick={() => navigate("/image")}>
        <AiFillCloseSquare />
      </button>
    </StyledTranslatedImageArea>
  );
};

const StyledTranslatedImageArea = styled.div`
  position: relative;
  margin-top: 30px;
  & img {
    position: absolute;
    z-index: -1;
  }

  & .close-btn {
    position: absolute;
    width: 30px;
    height: 30px;
    right: 15px;
    top: 15px;
    color: #ff0000;
    background-color: transparent;
    padding: 0;
  }
`;
