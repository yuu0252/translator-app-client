import axios from "axios";
import { useEffect, useState } from "react";
import { FaMicrophone } from "react-icons/fa6";
import { FaStop } from "react-icons/fa";

const audioBlobToBase64 = (blob: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const arrayBuffer = reader.result;
      const base64Audio = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
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
  setLanguage,
  setOutputText,
}: {
  setTranscription: React.Dispatch<React.SetStateAction<string>>;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  setOutputText: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const SPEECH_TO_TEXT_URL = import.meta.env.VITE_SPEECH_TO_TEXT_URL;
  const TRANSLATE_URL = import.meta.env.VITE_TRANSLATE_URL;
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<any>(null);

  const languageCode = {
    "en-US": "en",
    "ja-JP": "ja",
    "yue-Hant-HK": "zh-TW",
    "cmn-Hant-TW": "zh-TW",
    "cmn-Hans-CN": "zh-CN",
    "vi-VN": "vi",
  };

  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach((track: any) => track.stop());
      }
    };
  }, [mediaRecorder]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.start();
      console.log("Recording started");

      recorder.addEventListener("dataavailable", async (event) => {
        console.log("Data available event triggered");
        const audioBlob = event.data;
        const base64audio = await audioBlobToBase64(audioBlob);

        try {
          axios
            .post(`${SPEECH_TO_TEXT_URL}?key=${API_KEY}`, {
              config: {
                encoding: "WEBM_OPUS",
                sampleRateHertz: 48000,
                languageCode: "ja-JP",
                alternativeLanguageCodes: Object.keys(languageCode),
              },
              audio: {
                content: base64audio,
              },
            })
            .then((res) => {
              const result = res.data.results[0];
              const languageCode = result.languageCode;
              const text = result.alternatives[0].transcript;

              setLanguage(languageCode);
              setTranscription(text);

              axios
                .post(`${TRANSLATE_URL}?key=${API_KEY}`, {
                  q: text,
                  source: languageCode[languageCode],
                  target: "en",
                  format: "text",
                })
                .then((res) => {
                  console.log(res.data);
                  setOutputText(res.data.data.translations[0].translatedText);
                });
            })
            .catch(() => {
              setTranscription("Recording failed");
              setRecording(false);
            });
        } catch {
          console.log("error");
        }
      });
      setRecording(true);
      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Error getting user media:", error);
    }
  };
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      console.log("Recording stopped");
      setRecording(false);
    }
  };

  return (
    <>
      {recording ? (
        <button onClick={stopRecording} className="stop-btn">
          <div>
            <FaStop />
          </div>
        </button>
      ) : (
        <button onClick={startRecording}>
          <div>
            <FaMicrophone />
          </div>
        </button>
      )}
    </>
  );
};
