import axios from 'axios';
import { useEffect, useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';

const audioBlobToBase64 = (blob: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const base64Audio = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );
      resolve(base64Audio);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
};

export const SimpleRecorder = () => {
  const {
    status,
    startRecording,
    stopRecording,
    resumeRecording,
    pauseRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({ audio: true });

  useEffect(() => {
    (async () => {
      const blob = await fetch(mediaBlobUrl).then((res) => res.blob());
      const base64audio = await audioBlobToBase64(blob);
      axios
        .post(
          `${import.meta.env.VITE_SPEECH_TO_TEXT_URL}?key=${
            import.meta.env.VITE_GOOGLE_API_KEY
          }`,
          {
            config: {
              encoding: 'WEBM_OPUS',
              sampleRateHertz: 48000,
              languageCode: 'ja-JP',
              // alternativeLanguageCodes: Object.keys(languageCodeList),
            },
            audio: {
              content: base64audio,
            },
          }
        )
        .then((res) => console.log(res.data));
    })();
  }, [mediaBlobUrl]);
  return (
    <div>
      <main>
        <div>
          <div>
            <button onClick={startRecording} type="button">
              Record
            </button>
            <button onClick={stopRecording} type="button">
              Stop
            </button>
          </div>
          <div>
            <audio src={mediaBlobUrl} controls />
          </div>
        </div>
      </main>
    </div>
  );
};
