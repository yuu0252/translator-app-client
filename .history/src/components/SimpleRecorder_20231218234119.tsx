import { useState } from 'react';
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

  const [isNowRecording, setIsNowRecording] = useState(false);

  function onStart() {
    startRecording();
    setIsNowRecording(true);
  }
  function onPause() {
    pauseRecording();
  }
  function onResume() {
    resumeRecording();
  }
  async function onStop() {
    stopRecording();
    setIsNowRecording(false);
    const blob = await fetch(mediaBlobUrl).then((res) => res.blob());
    console.log(await audioBlobToBase64(blob));
  }
  return (
    <div>
      <main>
        <div>
          <div>
            <button onClick={onStart} type="button">
              Record
            </button>
            <button onClick={onPause} type="button">
              Pause
            </button>
            <button onClick={onResume} type="button">
              Resume
            </button>
            <button onClick={onStop} type="button">
              Stop
            </button>
          </div>
          <div>
            <audio src={mediaBlobUrl} controls />
          </div>

          <div>{isNowRecording ? <p>録音中</p> : <p>録音可能</p>}</div>
          <p>{status}</p>
        </div>
      </main>
    </div>
  );
};
