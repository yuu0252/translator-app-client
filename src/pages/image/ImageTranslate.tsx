import { resizeImage } from '../../functions/image/resizeImage';
import { useState } from 'react';
import { Header } from '../../components/Header';
import { Navigate, useNavigate } from 'react-router';
import { recognizeImage } from '../../functions/image/recognizeImage';
import { imageRecognizedData } from '../../functions/image/imageRecognizedData';
import { useSelector } from 'react-redux';
import { selectLanguage } from '../../reducer/languageSlice';
import { languageCodeList } from '../../constants';
import styled from 'styled-components';
import { selectLogin } from '../../reducer/loginSlice';

export const ImageTranslation = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [resizedFile, setResizedFile] = useState<Blob | null>();
  const navigate = useNavigate();
  const { isLogin } = useSelector(selectLogin);
  const { currentLanguage } = useSelector(selectLanguage);
  const languageName = languageCodeList.find(
    (e) => e.code === currentLanguage
  )?.name;

  const onChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // ファイルが変更されるとプレビューが表示される
    const target = e.target as HTMLInputElement;
    const file = (target.files as FileList)[0];

    if (!file) {
      return;
    }

    const blobUrl = window.URL.createObjectURL(file);

    const blob = await fetch(blobUrl).then((res) => res.blob());

    // 画面の幅に合わせて画像のサイズを変更する
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
      // 画像のテキストを認識して翻訳する
      const translatedData = await recognizeImage(base64);
      // APIから返ってきた値を読み取りやすい形式にする
      const resultData = imageRecognizedData(translatedData);
      // 翻訳された画像を別のページで表示する
      navigate('/translatedImage', {
        state: { imageUrl: imageUrl, data: resultData, isJapanese: isJapanese },
      });
    };

    reader.onerror = (e) => {
      console.error(e);
    };
  };

  const onClickTranslateToForeign = () => {
    const isJapanese = false;
    getImage(isJapanese);
  };
  const onClickTranslatetoJapanese = () => {
    const isJapanese = true;
    getImage(isJapanese);
  };

  return isLogin ? (
    <>
      <Header />
      <StyledImage id="image" className="container">
        <div className="content-area">
          <div className="image-area">
            {imageUrl ? (
              <>
                <img src={imageUrl} />
                <div className="btn-area">
                  {currentLanguage === 'none' ? (
                    <p className="alert">言語を選択してください</p>
                  ) : (
                    <>
                      <button onClick={onClickTranslateToForeign}>
                        日本語に翻訳
                      </button>
                      <button onClick={onClickTranslatetoJapanese}>
                        {languageName}に翻訳
                      </button>
                    </>
                  )}
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
  ) : (
    <Navigate to="/login" />
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
          color: #000;
          background-color: #fff;
        }
        &:last-of-type {
          color: #fff;
          background-color: #555;
        }
      }

      & .alert {
        color: #fff;
        background-color: #555;
        padding: 15px;
        box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.2);
        border: solid 3px #fff;
        border-radius: 5px;
        text-align: center;
      }
    }
  }
  & .input-area {
    padding: 15px;
    & label {
      padding: 10px 40px;
      font-weight: bold;
      cursor: pointer;
      border-radius: 10px;
      color: #fff;
      background-color: #000;
      border: #fff solid 3px;

      &:hover {
        color: #555;
        background-color: #fff;
        border: #000 solid 3px;
      }
    }

    & input[type='file'] {
      display: none;
    }
  }
`;
