import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import styled from 'styled-components';
import { Header } from '../components/Header';
import { AiFillCloseSquare } from 'react-icons/ai';
import { translateText } from '../functions/translate/translateText';
import { useSelector } from 'react-redux';
import { selectLanguage } from '../reducer/languageSlice';
import { languageCodeList } from '../constants';

type outputData = {
  outputText: string;
  style: object;
};

export const TranslatedImageArea = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [imageWidth, setImageWidth] = useState<number>();
  const [imageHeight, setImageHeight] = useState<number>();
  const imageUrl = location.state.imageUrl;
  const data = location.state.data;
  const isJapanese = location.state.isJapanese;
  const language = useSelector(selectLanguage);
  const languageCode = languageCodeList.find(
    (e) => e.code === language.language
  )?.query;
  const [translatedData, setTranslatedData] = useState<Array<object>>();
  const image = useRef<HTMLImageElement>(null);

  console.log(data);

  useEffect(() => {
    console.log('useEffect');
    const outputData: Array<outputData> = [];

    const loadImage = (src: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
      });
    };

    loadImage(imageUrl)
      .then(async (res: any) => {
        setImageWidth(res.naturalWidth);
        setImageHeight(res.naturalHeight);
        await Promise.all(
          data.map(
            async ({
              text,
              boundingBox,
            }: {
              text: string;
              boundingBox: Array<{ x: number; y: number }>;
            }) => {
              const width =
                ((boundingBox[1].x - boundingBox[0].x) / res.naturalWidth) *
                  100 +
                10;
              const height =
                ((boundingBox[3].y - boundingBox[1].y) / res.naturalHeight) *
                100;
              const top = (boundingBox[0].y / res.naturalHeight) * 100 + '%';
              const left =
                (boundingBox[0].x / res.naturalWidth) * 100 - 5 + '%';
              const fontSize = (width + height) / 2;
              const style = {
                display: 'flex',
                position: 'absolute',
                width: width + '%',
                minHeight: height + '%',
                top: top,
                left: left,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                color: '#fff',
                fontSize: fontSize + 'px',
                fontWeight: 'bold',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                opacity: '0.8',
              };
              const outputText = languageCode
                ? await translateText(text, languageCode, isJapanese)
                : '翻訳に失敗しました';
              if (outputText === text) return;
              outputData.push({ outputText: outputText, style: style });
            }
          )
        );
        setTranslatedData(outputData);
      })
      .catch((err) => console.log(err));
  }, [languageCode]);

  return (
    <>
      <Header />
      <StyledTranslatedImageArea
        style={{ width: imageWidth, height: imageHeight }}
      >
        {translatedData &&
          translatedData.map((e: any) => (
            <p key={e.outputText} style={e.style}>
              {e.outputText}
            </p>
          ))}
        <img src={imageUrl} ref={image} />
        <button className="close-btn" onClick={() => navigate('/image')}>
          <AiFillCloseSquare />
        </button>
      </StyledTranslatedImageArea>
    </>
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
