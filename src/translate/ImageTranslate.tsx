import { resizeImage } from '../functions/image/resizeImage';
import { useRef, useState } from 'react';
import { Header } from '../components/Header';
import { useNavigate } from 'react-router';
import { translateImage } from '../functions/image/translateImage';
import { imageTranslatedData } from '../functions/image/imageTranslatedData';

export const ImageTranslation = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [resizedFile, setResizedFile] = useState<Blob | null>();
  const navigate = useNavigate();

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

  const onClickTranslate = () => {
    const reader = new FileReader();
    resizedFile && reader.readAsDataURL(resizedFile);
    reader.onload = async () => {
      const result = reader.result as string;
      const base64 = result.replace('data:', '').replace(/^.+,/, '');
      const translatedData = await translateImage(base64);
      const resultData = imageTranslatedData(translatedData);
      navigate('/translatedImage', {
        state: { imageUrl: imageUrl, data: resultData },
      });
    };
  };

  return (
    <>
      <Header />
      <section id="image" className="container">
        <div className="content-area">
          <div className="image-area">
            {imageUrl ? (
              <>
                <img src={imageUrl} />
                <button onClick={onClickTranslate}>翻訳する</button>
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
      </section>
    </>
  );
};
