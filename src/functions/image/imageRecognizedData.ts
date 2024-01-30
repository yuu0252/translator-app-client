import { imageRecognizedResult, recognizedData } from '../../type';

export const imageRecognizedData = (recognizedData: recognizedData) => {
  const dataArr =
    recognizedData.responses[0].fullTextAnnotation.pages[0].blocks;
  const result: Array<imageRecognizedResult> = [];
  dataArr.forEach((block) => {
    const fullTextArr: Array<string> = [];
    const arr = block.paragraphs;
    const boundingBox = block.boundingBox.vertices;
    arr.forEach((paragraphs) => {
      const wordArr = paragraphs.words;
      wordArr.forEach((word) => {
        const symbolArr = word.symbols;
        symbolArr.forEach((symbol: any) => {
          fullTextArr.push(symbol.text);
        });
      });
    });
    result.push({
      text: fullTextArr.join(''),
      boundingBox: boundingBox,
    });
  });

  return result;
};
