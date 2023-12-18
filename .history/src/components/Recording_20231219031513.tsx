import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { selectLanguage, setLanguage } from '../languageSlice';
import { languageCodeList } from '../constants';
import { FaMicrophone } from 'react-icons/fa6';
import { FaStop } from 'react-icons/fa';

export const Recording = ({
  setTranscription,
  setOutputText,
}: {
  setTranscription: React.Dispatch<React.SetStateAction<string>>;
  setOutputText: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const language = useSelector(selectLanguage);
  const dispatch = useDispatch();

  let audioSampleRate: number;
  let audioContext: AudioContext | null;
  let bufferSize = 1024;
  let audioData: Array<any> = [];
  let recordingFlg = false;
  let destinationNode: any;

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

  function startRecording() {
    const stopBtn: any = document.getElementsByClassName('stop-btn');
    stopBtn.classList.remove('none');
    console.log('startRecording');
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

    let scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);

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
  }

  function _startRecordingWithStream(
    stream: any,
    destinationNode: any,
    scriptProcessor: any
  ) {
    let mediastreamsource = audioContext?.createMediaStreamSource(stream);
    mediastreamsource?.connect(scriptProcessor);
    scriptProcessor.onaudioprocess = onAudioProcess;
    console.log(
      'startRecording scriptProcessor.connect(audioContext.destination)'
    );
    scriptProcessor.connect(destinationNode);
  }

  function stopRecording() {
    console.log('endRecording');
    recordingFlg = false;
    let blob = exportWAV(audioData);

    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      const base64data = reader.result as string;

      axios
        .post(
          `${import.meta.env.VITE_SPEECH_TO_TEXT_URL}?key=${
            import.meta.env.VITE_GOOGLE_API_KEY
          }`,
          {
            config: {
              languageCode: 'ja-JP',
              alternativeLanguageCodes: Object.keys(languageCodeList),
            },
            audio: {
              content: base64data.split(',')[1],
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

          languageCode === 'ja-jp' || dispatch(setLanguage(languageCode));
          setTranscription(text);

          const source =
            languageCode === 'ja-jp'
              ? 'ja'
              : languageCodeList[languageCode].code;
          const target =
            languageCode === 'ja-jp'
              ? languageCodeList[language.language].code
              : 'ja';

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
    };

    audioContext && audioContext.close();
    audioContext = null;
    audioData = [];
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
      <button onClick={stopRecording} className="stop-btn none">
        <div>
          <FaStop />
        </div>
      </button>
      <button onClick={startRecording} className="start-btn">
        <div>
          <FaMicrophone />
        </div>
      </button>
    </>
  );
};
