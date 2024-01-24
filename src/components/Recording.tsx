import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import { setTranscription, setOutputText } from '../reducer/translateSlice';
import { languageCodeList } from '../constants';
import { FaMicrophone } from 'react-icons/fa6';
import { FaStop } from 'react-icons/fa';
import { useRef } from 'react';
import {
  selectLanguage,
  setIsJapanese,
  setCurrentLanguage,
} from '../reducer/languageSlice';
import { setIsLoading } from '../reducer/loadingSlice';

export const Recording = () => {
  const startBtn = useRef<HTMLButtonElement>(null);
  const stopBtn = useRef<HTMLButtonElement>(null);
  const { currentLanguage } = useSelector(selectLanguage);

  const dispatch = useDispatch();

  let audioSampleRate: number;
  let audioContext: AudioContext | null;
  let bufferSize = 1024;
  let audioData: Array<any> = [];
  let recordingFlg = false;
  let destinationNode: any;
  let mediastreamsource: any;
  let scriptProcessor: any;

  function onAudioProcess(e: any) {
    if (!recordingFlg) return;
    console.log('onAudioProcess');

    let input = e.inputBuffer.getChannelData(0);
    let bufferData = new Float32Array(bufferSize);
    for (let i = 0; i < bufferSize; i++) {
      bufferData[i] = input[i];
    }
    audioData.push(bufferData);
  }

  const startRecording = async () => {
    if (stopBtn.current) stopBtn.current.style.display = 'block';
    recordingFlg = true;

    if (
      !navigator ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      alert('Missing support for navigator.mediaDevices.getUserMedia');
      return;
    }

    audioContext = new window.AudioContext();
    audioSampleRate = audioContext.sampleRate;

    scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);

    if (audioContext.createMediaStreamDestination) {
      destinationNode = audioContext.createMediaStreamDestination();
    } else {
      destinationNode = audioContext.destination;
    }

    return navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        _startRecordingWithStream(stream, destinationNode, scriptProcessor);
      })
      .catch((error) => {
        alert('Error with getUserMedia: ' + error.message);
        console.log(error);
      });
  };

  function _startRecordingWithStream(
    stream: any,
    destinationNode: any,
    scriptProcessor: any
  ) {
    mediastreamsource = audioContext?.createMediaStreamSource(stream);
    mediastreamsource?.connect(scriptProcessor);
    scriptProcessor.onaudioprocess = onAudioProcess;
    scriptProcessor.connect(destinationNode);
  }

  function stopRecording() {
    dispatch(setIsLoading(true));
    // ストップボタンを押すとストップボタンを録音ボタンに変更
    if (startBtn.current) startBtn.current.style.display = 'block';
    recordingFlg = false;
    let blob = exportWAV(audioData);

    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      const base64data = reader.result as string;

      // google translate APIの複数言語設定
      const altLanguageCodes =
        currentLanguage === 'none'
          ? languageCodeList.map((language) => language.code)
          : [currentLanguage];

      // 音声をテキストに変換
      axios
        .post(
          `${import.meta.env.VITE_SPEECH_TO_TEXT_URL}?key=${
            import.meta.env.VITE_GOOGLE_API_KEY
          }`,
          {
            config: {
              languageCode: 'ja-JP',
              alternativeLanguageCodes: altLanguageCodes,
            },
            audio: {
              content: base64data.split(',')[1],
            },
          }
        )
        .then((res) => {
          const result = res.data.results[0];
          const detectedLanguage = result.languageCode;
          const text = result.alternatives[0].transcript;

          // 入力言語が日本語かどうか
          dispatch(setIsJapanese(detectedLanguage === 'ja-jp' ? true : false));

          let sourceLanguage: string | undefined;
          let targetLanguage: string | undefined;

          // 入力が日本語であるときに出力言語が設定されていなければ英語に変換する
          if (detectedLanguage === 'ja-jp' && currentLanguage === 'none') {
            dispatch(setCurrentLanguage('en-us'));
            sourceLanguage = 'ja';
            targetLanguage = 'en';
          } else if (detectedLanguage === 'ja-jp') {
            dispatch(setCurrentLanguage(detectedLanguage));
            const targetCode = languageCodeList.find(
              (e) => e.code === currentLanguage
            );
            sourceLanguage = 'ja';
            targetLanguage = targetCode?.shortCode;
          } else {
            if (detectedLanguage !== 'ja-jp' && currentLanguage === 'none') {
              dispatch(setCurrentLanguage(detectedLanguage));
            }
            const sourceCode = languageCodeList.find(
              (e) => e.code === detectedLanguage
            );
            sourceLanguage = sourceCode?.shortCode;
            targetLanguage = 'ja';
          }

          dispatch(setTranscription(text));

          // 出力されたテキストを翻訳する
          axios
            .post(
              `${import.meta.env.VITE_TRANSLATE_URL}?key=${
                import.meta.env.VITE_GOOGLE_API_KEY
              }`,
              {
                q: text,
                source: sourceLanguage,
                target: targetLanguage,
                format: 'text',
              }
            )
            .then((res) => {
              dispatch(
                setOutputText(res.data.data.translations[0].translatedText)
              );
              dispatch(setIsLoading(false));
            })
            .catch(() => {
              dispatch(setOutputText('翻訳に失敗しました'));
              dispatch(setIsLoading(false));
            });
        })
        .catch(() => {
          dispatch(setTranscription('音声認識に失敗しました'));
          dispatch(setIsLoading(false));
        });
    };

    audioContext && audioContext.close();
    audioContext = null;
    audioData = [];
    destinationNode.disconnect();
  }

  function exportWAV(audioData: any) {
    let encodeWAV = function (samples: any, sampleRate: any) {
      let buffer = new ArrayBuffer(44 + samples.length * 2);
      let view = new DataView(buffer);

      let writeString = function (
        view: DataView,
        offset: number,
        string: string
      ) {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };

      let floatTo16BitPCM = function (
        output: any,
        offset: number,
        input: Array<number>
      ) {
        for (let i = 0; i < input.length; i++, offset += 2) {
          let s = Math.max(-1, Math.min(1, input[i]));
          output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        }
      };

      writeString(view, 0, 'RIFF');
      view.setUint32(4, 32 + samples.length * 2, true);
      writeString(view, 8, 'WAVE');
      writeString(view, 12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(view, 36, 'data');
      view.setUint32(40, samples.length * 2, true);
      floatTo16BitPCM(view, 44, samples);

      return view;
    };

    let mergeBuffers = function (audioData: any) {
      let sampleLength = 0;
      for (let i = 0; i < audioData.length; i++) {
        sampleLength += audioData[i].length;
      }
      let samples = new Float32Array(sampleLength);
      let sampleIdx = 0;
      for (let i = 0; i < audioData.length; i++) {
        for (let j = 0; j < audioData[i].length; j++) {
          samples[sampleIdx] = audioData[i][j];
          sampleIdx++;
        }
      }
      return samples;
    };

    let dataview = encodeWAV(mergeBuffers(audioData), audioSampleRate);
    let audioBlob = new Blob([dataview], { type: 'audio/wav' });

    return audioBlob;
  }
  return (
    <>
      <button
        ref={stopBtn}
        onClick={(e) => {
          e.currentTarget.style.display = 'none';
          stopRecording();
        }}
        className="stop-btn"
      >
        <div>
          <FaStop />
        </div>
      </button>
      <button
        ref={startBtn}
        onClick={(e) => {
          e.currentTarget.style.display = 'none';
          startRecording();
        }}
        className="start-btn"
      >
        <div>
          <FaMicrophone />
        </div>
      </button>
    </>
  );
};
