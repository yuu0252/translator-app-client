import { useState } from "react";
import { useLocation } from "react-router";
import styled from "styled-components";

type outputData = {
  text: string;
  style: {
    width: string;
    height: string;
    top: string;
    left: string;
  };
};

export const TranslatedImageArea = () => {
  const location = useLocation();
  const [imageWidth, setImageWidth] = useState<number>();
  const [imageHeight, setImageHeight] = useState<number>();
  const imageUrl = location.state.imageUrl;
  const data = location.state.data;

  console.log(imageUrl);

  const img = new Image();
  img.src = imageUrl;
  img.onload = () => {
    setImageWidth(img.naturalWidth);
    setImageHeight(img.naturalHeight);
  };

  const outputData: Array<outputData> = [];

  console.log(data[0].boundingBox);

  data.forEach(
    ({
      text,
      boundingBox,
    }: {
      text: string;
      boundingBox: Array<{ x: number; y: number }>;
    }) => {
      if (!imageHeight || !imageWidth) return;
      const width =
        ((boundingBox[1].x - boundingBox[0].x) / imageWidth) * 100 + "%";
      const height =
        ((boundingBox[3].y - boundingBox[1].y) / imageHeight) * 100 + "%";
      const top = (boundingBox[0].y / imageHeight) * 100 + "%";
      const left = (boundingBox[0].x / imageWidth) * 100 + "%";
      const style = {
        position: "absolute",
        width: width,
        height: height,
        top: top,
        left: left,
        backgroundColor: "#000",
        color: "#fff",
      };
      outputData.push({ text, style });
    }
  );

  return (
    <StyledTranslatedImageArea
      style={{ width: imageWidth, height: imageHeight }}
    >
      {outputData.map(({ text, style }: outputData) => (
        <p key={text} style={style}>
          {text}
        </p>
      ))}
      <img src={imageUrl} />
    </StyledTranslatedImageArea>
  );
};

const StyledTranslatedImageArea = styled.div`
  position: relative;
  & img {
    position: absolute;
    z-index: -1;
  }
`;
