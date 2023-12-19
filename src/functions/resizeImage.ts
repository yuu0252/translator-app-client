export const resizeImage = async (
  imageData: Blob,
  width: number
): Promise<Blob | null> => {
  try {
    const context = document.createElement('canvas').getContext('2d');
    if (context === null) {
      return null;
    }

    const image: HTMLImageElement = await new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', reject);
      image.src = URL.createObjectURL(imageData);
    });

    const { naturalHeight: beforeHeight, naturalWidth: beforeWidth } = image;

    const afterWidth: number = width;

    const afterHeight: number = Math.floor(
      beforeHeight * (afterWidth / beforeWidth)
    );

    context.canvas.width = afterWidth;
    context.canvas.height = afterHeight;
    context.drawImage(
      image,
      0,
      0,
      beforeWidth,
      beforeHeight,
      0,
      0,
      afterWidth,
      afterHeight
    );

    return await new Promise((resolve) => {
      context.canvas.toBlob(resolve, 'image/jpeg', 0.9);
    });
  } catch (err) {
    console.error(err);
    return null;
  }
};
