import { useState } from 'react';
import { FaMicrophone } from 'react-icons/fa6';
import { useReactMediaRecorder } from 'react-media-recorder-2';

export const Recording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });
  console.log(mediaBlobUrl);
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
    </>
  );
};
