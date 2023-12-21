export const base64ToBlobUrl = (base64: string) => {
  const bin = atob(base64.replace(/^.*,/, ''));
  const buffer = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    buffer[i] = bin.charCodeAt(i);
  }
  return window.URL.createObjectURL(
    new Blob([buffer.buffer], { type: 'audio/wav' })
  );
};
