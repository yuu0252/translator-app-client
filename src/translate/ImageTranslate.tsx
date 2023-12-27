import { resizeImage } from '../functions/image/resizeImage';
import { useState } from 'react';
import { Header } from '../components/Header';
import { useNavigate } from 'react-router';
import { recognizeImage } from '../functions/image/recognizeImage';
import { imageRecognizedData } from '../functions/image/imageRecognizedData';
import { useSelector } from 'react-redux';
import { selectLanguage } from '../reducer/languageSlice';
import { languageCodeList } from '../constants';
import styled from 'styled-components';

export const ImageTranslation = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [resizedFile, setResizedFile] = useState<Blob | null>();
  const navigate = useNavigate();
  const { language } = useSelector(selectLanguage);
  const languageName = languageCodeList.find((e) => e.code === language)?.name;

  const onChangeImage = async (e: any) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const blobUrl = window.URL.createObjectURL(file);

    const blob = await fetch(blobUrl).then((res) => res.blob());

    const resizedFileData = await resizeImage(blob, window.innerWidth);
    setResizedFile(resizedFileData);
    if (resizedFileData) {
      setImageUrl(window.URL.createObjectURL(resizedFileData));
    }
  };

  const getImage = (isJapanese: boolean) => {
    const reader = new FileReader();
    resizedFile && reader.readAsDataURL(resizedFile);
    reader.onload = async () => {
      const result = reader.result as string;
      const base64 = result.replace('data:', '').replace(/^.+,/, '');
      const translatedData = await recognizeImage(base64);
      const resultData = imageRecognizedData(translatedData);
      navigate('/translatedImage', {
        state: { imageUrl: imageUrl, data: resultData, isJapanese: isJapanese },
      });
    };

    reader.onerror = (e) => {
      console.log(e);
    };
  };

  const onClickTranslateToForeign = () => {
    getImage(false);
  };
  const onClickTranslatetoJapanese = () => {
    getImage(true);
  };

  return (
    <>
      <Header />
      <StyledImage id="image" className="container">
        <div className="content-area">
          <div className="image-area">
            {imageUrl ? (
              <>
                <img src={imageUrl} />
                <div className="btn-area">
                  <button onClick={onClickTranslateToForeign}>
                    日本語に翻訳
                  </button>
                  <button onClick={onClickTranslatetoJapanese}>
                    {languageName}に翻訳
                  </button>
                </div>
              </>
            ) : (
              'ファイルを選択してください'
            )}
          </div>
        </div>
        <div className="input-area">
          <label>
            <input type="file" id="file" onChange={onChangeImage} />
            ファイルを選択
          </label>
        </div>
      </StyledImage>
    </>
  );
};

const StyledImage = styled.section`
  & .image-area {
    position: relative;
    & > img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    & > .btn-area {
      display: flex;
      position: absolute;
      flex-direction: column;
      left: 50%;
      transform: translateX(-50%);
      row-gap: 30px;
      & > button {
        width: auto;
        height: auto;

        border-radius: 5px;
        white-space: nowrap;
        color: #fff;

        border: #333 3px solid;
        box-shadow: #fff 0 0 5px 5px;

        &:first-of-type {
          background: linear-gradient(
            to bottom,
            #f85032 0%,
            #f16f5c 31%,
            #f6290c 53%,
            #f02f17 71%,
            #e73827 100%
          );
        }
        &:last-of-type {
          background: linear-gradient(
            to bottom,
            #b7deed 0%,
            #71ceef 50%,
            #21b4e2 51%,
            #b7deed 100%
          );
        }
      }
    }
  }
  & .input-area {
    padding: 15px;
    & label {
      padding: 10px 40px;
      color: #ffffff;
      background-color: #384878;
      cursor: pointer;
      background-image: linear-gradient(
        90deg,
        rgba(103, 126, 250, 1),
        rgba(142, 84, 219, 1)
      );
      border-radius: 10px;
      border: #fff solid 3px;
    }

    & input[type='file'] {
      display: none;
    }
  }
`;
