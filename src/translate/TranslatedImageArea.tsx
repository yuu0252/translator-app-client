import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import styled from 'styled-components';
import { Header } from '../components/Header';
import { AiFillCloseSquare } from 'react-icons/ai';
import { translateText } from '../functions/translate/translateText';
import { useSelector } from 'react-redux';
import { selectLanguage } from '../reducer/languageSlice';
import { languageCodeList } from '../constants';
import { setOutputText } from '../reducer/translateSlice';

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
  const language = useSelector(selectLanguage);
  const languageCode = languageCodeList.find(
    (e) => e.code === language.language
  )?.query;
  const [translatedData, setTranslatedData] = useState<Array<object>>();

  const img = new Image();
  img.src = imageUrl;
  img.onload = () => {
    setImageWidth(img.naturalWidth);
    setImageHeight(img.naturalHeight);
  };

  useEffect(() => {
    console.log('useEffect');
    const outputData: Array<outputData> = [];

    data.forEach(
      async ({
        text,
        boundingBox,
        isJapanese,
      }: {
        text: string;
        boundingBox: Array<{ x: number; y: number }>;
        isJapanese: boolean;
      }) => {
        console.log('before');
        if (!imageHeight || !imageWidth) return;
        console.log('after');
        const width =
          ((boundingBox[1].x - boundingBox[0].x) / imageWidth) * 100 + '%';
        const height =
          ((boundingBox[3].y - boundingBox[1].y) / imageHeight) * 100 + '%';
        const top = (boundingBox[0].y / imageHeight) * 100 + '%';
        const left = (boundingBox[0].x / imageWidth) * 100 + '%';
        const fontSize = 16;
        const style = {
          display: 'flex',
          position: 'absolute',
          width: width,
          minHeight: height,
          top: top,
          left: left,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          color: '#fff',
          fontSize: fontSize + 'px',
          fontWeight: 'bold',
          alignItems: 'center',
          justifyContent: 'center',
        };
        const outputText = await translateText(text, languageCode, isJapanese);
        outputData.push({ outputText, style });
      }
    );
    setTranslatedData(outputData);
  }, [imageWidth, imageHeight, languageCode]);

  return (
    <>
      <Header />
      <StyledTranslatedImageArea
        style={{ width: imageWidth, height: imageHeight }}
      >
        {translatedData &&
          translatedData.map(({ outputText, style }: outputData) => (
            <p key={outputText} style={style}>
              {outputText}
            </p>
          ))}
        <img src={imageUrl} />
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
