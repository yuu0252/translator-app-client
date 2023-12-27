import axios from 'axios';

export const recognizeImage = async (base64: string) => {
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

  const result = await axios
    .post(
      `${import.meta.env.VITE_VISION_URL}?key=${
        import.meta.env.VITE_GOOGLE_API_KEY
      }`,
      data
    )
    .then((res) => {
      return res.data;
    });

  return result;
};
