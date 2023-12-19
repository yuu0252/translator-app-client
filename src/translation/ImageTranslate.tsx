import axios from 'axios';
import { resizeImage } from '../functions/resizeImage';
import { useRef, useState } from 'react';
import { Header } from '../components/Header';

export const ImageTranslation = () => {
  const [imageUrl, setImageUrl] = useState('');
  const imageArea = useRef<HTMLDivElement>(null);

  const fetchApi = (base64: string) => {
    if (!base64) return;

    const data = {
      requests: [
        {
          image: {
            content: base64,
          },
          features: [
            {
              type: 'TEXT_DETECTION',
            },
          ],
        },
      ],
    };

    console.log(data);

    axios
      .post(
        `https://vision.googleapis.com/v1/images:annotate?key=${
          import.meta.env.VITE_GOOGLE_API_KEY
        }`,
        data
      )
      .then((res) => {
        console.log(res);
      });
  };

  const onChangeImage = async (e: any) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const blobUrl = window.URL.createObjectURL(file);

    const blob = await fetch(blobUrl).then((res) => res.blob());

    const resizedFile = await resizeImage(
      blob,
      imageArea.current ? imageArea.current.clientWidth : 500
    );
    if (resizedFile) {
      setImageUrl(window.URL.createObjectURL(resizedFile));
    }

    const reader = new FileReader();
    resizedFile && reader.readAsDataURL(resizedFile);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.replace('data:', '').replace(/^.+,/, '');
      fetchApi(base64);
    };
  };

  return (
    <>
      <Header />
      <section id="image" className="container">
        <div className="content-area">
          <div ref={imageArea}>
            {imageUrl ? <img src={imageUrl} /> : 'ファイルを選択してください'}
          </div>
        </div>
        <input type="file" id="file" onChange={onChangeImage} />
      </section>
    </>
  );
};
