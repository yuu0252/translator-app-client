export const imageRecognizedData = (data: any) => {
  const dataArr = data.responses[0].fullTextAnnotation.pages[0].blocks;
  const result: any = [];
  dataArr.forEach((data: any) => {
    const fullTextArr: Array<string> = [];
    const arr = data.paragraphs;
    const boundingBox = data.boundingBox.vertices;
    let line = 0;
    console.log(arr);
    arr.forEach((obj: any) => {
      const wordArr = obj.words;
      wordArr.forEach((word: any) => {
        const symbolArr = word.symbols;
        symbolArr.forEach((symbol: any) => {
          fullTextArr.push(symbol.text);

          if (symbol.property?.detectedBreak.type === 'LINE_BREAK') line += 1;
        });
      });
    });
    result.push({
      text: fullTextArr.join(''),
      boundingBox: boundingBox,
      line: line,
    });
  });

  return result;
};
