import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaMicrophone } from 'react-icons/fa6';
import { useReactMediaRecorder } from 'react-media-recorder-2';

export const Recording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });
  useEffect(() => {
    const data = {
      audio: {
        content: mediaBlobUrl,
      },
      config: {
        enableAutomaticPunctuation: true,
        encoding: 'LINEAR16',
        languageCode: 'ja-JP',
        model: 'default',
      },
    };
    axios.post(import.meta.env.VITE_SPEECH_TO_TEXT_URL, data);
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
