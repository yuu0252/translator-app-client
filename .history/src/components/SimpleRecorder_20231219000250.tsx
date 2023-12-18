import axios from 'axios';
import { useEffect, useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { FaMicrophone } from 'react-icons/fa6';
import { FaStop } from 'react-icons/fa';
import { languageCodeList } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import { selectLanguage, setLanguage } from '../languageSlice';

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

export const SimpleRecorder = ({
  setTranscription,
  setOutputText,
}: {
  setTranscription: React.Dispatch<React.SetStateAction<string>>;
  setOutputText: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [recording, setRecording] = useState(false);
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
        .then((res) => {
          console.log(res.data.results[0]);
          setRecording(false);
        });
    })();
  }, [mediaBlobUrl]);
  return (
    <>
      {status ? (
        <button onClick={stopRecording} className="stop-btn">
          <div>
            <FaStop />
          </div>
        </button>
      ) : (
        <button onClick={startRecording} className="start-btn">
          <div>
            <FaMicrophone />
          </div>
        </button>
      )}
    </>
  );
};
