import { useState } from 'react';
import { useLocation } from 'react-router';

export const TranslatedImageArea = () => {
  const location = useLocation();
  const [imgWidth, setImageWidth] = useState<number>();
  const imageUrl = location.state.imageUrl;
  const data = location.state.data;

  console.log(imageUrl);

  const img = new Image();
  img.src = imageUrl;
  let imgHeight: number;
  img.onload = () => {
    setImageWidth(img.naturalWidth);
    imgHeight = img.naturalHeight;
  };

  data.forEach(
    ({ boundingBox }: { boundingBox: Array<{ x: number; y: number }> }) => {
      const width = boundingBox[1].x - boundingBox[0].x;
      const height = boundingBox[3].y - boundingBox[1].y;
      const top = boundingBox[0].y / imgHeight;
      const left = boundingBox[0].x / imgWidth;
      console.log(boundingBox[0].y, imgHeight);
    }
  );

  const style = {};
  return (
    <div>
      {data.map(
        ({
          text,
          boundBox,
        }: {
          text: string;
          boundBox: { x: number; y: number };
        }) => (
          <p style={style}>{text}</p>
        )
      )}
      <img src={imageUrl} />
    </div>
  );
};
