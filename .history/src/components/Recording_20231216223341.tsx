import { useEffect, useState } from 'react';
import { FaMicrophone } from 'react-icons/fa6';
import { useReactMediaRecorder } from 'react-media-recorder-2';

export const Recording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });
  useEffect(() => {
    const data = async () => {
      if (!mediaBlobUrl) return;
      const blob = fetch(mediaBlobUrl).then((r) => r.blob());
      const blobText = await blob.text();
      console.log(blobText);
    };
    data();
  }, [mediaBlobUrl]);
  return (
    <>
      <p>{status}</p>
      <button onClick={startRecording}>
        <div>
          <FaMicrophone />
        </div>
      </button>
      <button onClick={stopRecording}>
        <div>Stop</div>
      </button>
      <audio src={mediaBlobUrl} controls />
    </>
  );
};
