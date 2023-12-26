import axios from 'axios';

export const translateImage = async (base64: string) => {
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

  const result = await axios
    .post(
      `https://vision.googleapis.com/v1/images:annotate?key=${
        import.meta.env.VITE_GOOGLE_API_KEY
      }`,
      data
    )
    .then((res) => {
      return res.data;
    });

  return result;
};
