import { useDispatch } from 'react-redux';

import { FaMicrophone } from 'react-icons/fa6';
import { FaStop } from 'react-icons/fa';
import { useRef } from 'react';

import { setIsLoading } from '../reducer/loadingSlice';
import { speechToText } from '../functions/audio/speechToText';
import { exportWAV } from '../functions/audio/recording/exportWAV';

export const Recording = () => {
  const startBtn = useRef<HTMLButtonElement>(null);
  const stopBtn = useRef<HTMLButtonElement>(null);

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
    let blob = exportWAV(audioData, audioSampleRate);

    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      const base64data = reader.result as string;
      speechToText(base64data);
    };

    audioContext && audioContext.close();
    audioContext = null;
    audioData = [];
    destinationNode.disconnect();
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
