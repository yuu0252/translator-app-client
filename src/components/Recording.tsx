import axios from "axios";
import { useEffect, useState } from "react";
import { FaMicrophone } from "react-icons/fa6";
import { RiRectangleFill } from "react-icons/ri";

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

export const Recording = () => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<any>(null);
  const [transcription, setTranscription] = useState("");

  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach((track: any) => track.stop());
      }
    };
  }, [mediaRecorder]);

  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const URL = import.meta.env.VITE_SPEECH_TO_TEXT_URL;
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
          const response = await axios
            .post(`${URL}?key=${API_KEY}`, {
              config: {
                encoding: "WEBM_OPUS",
                sampleRateHertz: 48000,
                languageCode: "en-US",
                alternativeLanguageCodes: ["ja-JP"],
              },
              audio: {
                content: base64audio,
              },
            })
            .then((res) => {
              setTranscription(res.data.results[0]);
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
      <p>{transcription}</p>
      {recording ? (
        <button onClick={stopRecording} className="stop-btn">
          <div>
            <RiRectangleFill />
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
