import axios from 'axios';

export const ImageTranslation = () => {
  const fetch = (base64: string) => {
    if (!base64) return;

    const data = {
      image: {
        content: base64,
      },
      features: [
        {
          type: 'TEXT_DETECTION',
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

  const onChangeImage = (e: any) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.replace('data:', '').replace(/^.+,/, '');
      console.log(base64);
      fetch(base64);
    };
  };

  return (
    <>
      <input type="file" id="file" onChange={onChangeImage} />
      <img src="" />
    </>
  );
};
