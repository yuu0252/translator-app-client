import { TypeImageRecognizedResult, TypeRecognizedData } from "../../type";

// 画像を認識した後帰ってきたデータを処理
export const imageRecognizedData = (recognizedData: TypeRecognizedData) => {
  const dataArr =
    recognizedData.responses[0].fullTextAnnotation.pages[0].blocks;
  const result: Array<TypeImageRecognizedResult> = [];
  dataArr.forEach((block) => {
    const fullTextArr: Array<string> = [];
    const arr = block.paragraphs;
    // テキストの位置
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
      text: fullTextArr.join(""),
      boundingBox: boundingBox,
    });
  });

  return result;
};
