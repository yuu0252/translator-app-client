import axios from 'axios';
import { useEffect } from 'react';
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

export const Recording = ({
  setTranscription,
  setOutputText,
}: {
  setTranscription: React.Dispatch<React.SetStateAction<string>>;
  setOutputText: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const language = useSelector(selectLanguage);
  const dispatch = useDispatch();
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });

  useEffect(() => {
    if (!mediaBlobUrl) return;
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
              alternativeLanguageCodes: Object.keys(languageCodeList),
            },
            audio: {
              content: base64audio,
            },
          }
        )
        .then((res) => {
          const result = res.data.results[0];
          const languageCode = result.languageCode;
          const text = result.alternatives[0].transcript;

          if (languageCode === 'ja-jp' && language.language === 'none') {
            alert(
              '相手に先にしゃべってもらうか(自動検出)、言語を選んでください(右上)'
            );
            return;
          }

          dispatch(setLanguage(languageCode));
          setTranscription(text);

          const source =
            languageCode === 'ja-jp'
              ? 'ja'
              : languageCodeList[languageCode].code;
          const target = languageCode === 'ja-jp' ? language.language : 'ja';

          console.log(source + ':' + target);

          axios
            .post(
              `${import.meta.env.VITE_TRANSLATE_URL}?key=${
                import.meta.env.VITE_GOOGLE_API_KEY
              }`,
              {
                q: text,
                source: source,
                target: target,
                format: 'text',
              }
            )
            .then((res) => {
              setOutputText(res.data.data.translations[0].translatedText);
            })
            .catch((err) => {
              console.log(err);
              setOutputText('Translating failed');
            });
        })
        .catch((err) => {
          console.log(err);
          setTranscription('Recording failed');
        });
    })();
  }, [mediaBlobUrl]);
  return (
    <>
      {status === 'stopped' || status === 'idle' ? (
        <button onClick={startRecording} className="start-btn">
          <div>
            <FaMicrophone />
          </div>
        </button>
      ) : (
        <button onClick={stopRecording} className="stop-btn">
          <div>
            <FaStop />
          </div>
        </button>
      )}
    </>
  );
};
