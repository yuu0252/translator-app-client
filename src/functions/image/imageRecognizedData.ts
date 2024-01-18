export const imageRecognizedData = (data: any) => {
  const dataArr = data.responses[0].fullTextAnnotation.pages[0].blocks;
  const result: any = [];
  dataArr.forEach((data: any) => {
    const fullTextArr: Array<string> = [];
    const arr = data.paragraphs;
    const boundingBox = data.boundingBox.vertices;
    arr.forEach((obj: any) => {
      const wordArr = obj.words;
      wordArr.forEach((word: any) => {
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
