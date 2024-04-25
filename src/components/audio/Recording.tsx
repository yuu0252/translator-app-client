import { FaMicrophone } from "react-icons/fa6";
import { FaStop } from "react-icons/fa";
import { useRef } from "react";
import { setIsLoading } from "../../reducer/loadingSlice";
import { useDispatch } from "react-redux";
import { speechToText } from "../../functions/audio/speechToText";
import styled from "styled-components";
import { ClipLoader } from "react-spinners";

export const Recording = () => {
  const startBtn = useRef<HTMLButtonElement>(null);
  const stopBtn = useRef<HTMLButtonElement>(null);
  const loadingBtn = useRef<HTMLButtonElement>(null);
  const dispatch = useDispatch();

  let audioSampleRate: number;
  let audioContext: AudioContext | null;
  let bufferSize = 1024;
  let audioData: Array<any> = [];
  let recordingFlg = false;
  let destinationNode: any;
  let scriptProcessor: any;

  const startRecording = async () => {
    if (loadingBtn.current) loadingBtn.current.style.display = "block";
    recordingFlg = true;

    if (
      !navigator ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
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
        startRecordingWithStream(
          recordingFlg,
          stream,
          destinationNode,
          scriptProcessor,
          audioContext,
          audioData,
          bufferSize
        );
      })
      .catch(() => {
        alert("権限の取得に失敗しました");
      });
  };

  const exportWAV = (audioData: any, audioSampleRate: number) => {
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

      writeString(view, 0, "RIFF");
      view.setUint32(4, 32 + samples.length * 2, true);
      writeString(view, 8, "WAVE");
      writeString(view, 12, "fmt ");
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(view, 36, "data");
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
    let audioBlob = new Blob([dataview], { type: "audio/wav" });

    return audioBlob;
  };

  const startRecordingWithStream = (
    recordingFlg: boolean,
    stream: any,
    destinationNode: any,
    scriptProcessor: any,
    audioContext: any,
    audioData: any,
    bufferSize: number
  ) => {
    let mediastreamsource: any;

    function onAudioProcess(e: any) {
      if (!recordingFlg) return;
      console.log("onAudioProcess");

      let input = e.inputBuffer.getChannelData(0);
      let bufferData = new Float32Array(bufferSize);
      for (let i = 0; i < bufferSize; i++) {
        bufferData[i] = input[i];
      }
      audioData.push(bufferData);
    }

    mediastreamsource = audioContext?.createMediaStreamSource(stream);
    mediastreamsource?.connect(scriptProcessor);
    scriptProcessor.onaudioprocess = onAudioProcess;
    scriptProcessor.connect(destinationNode);
    // 音声認識の準備ができるまでローディングボタンを表示
    if (loadingBtn.current) loadingBtn.current.style.display = "none";
    if (stopBtn.current) stopBtn.current.style.display = "block";
  };

  function stopRecording() {
    dispatch(setIsLoading(true));
    // ストップボタンを押すとストップボタンを録音ボタンに変更
    if (startBtn.current) startBtn.current.style.display = "block";
    recordingFlg = false;
    let blob = exportWAV(audioData, audioSampleRate);

    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      const base64data = reader.result as string;
      speechToText(base64data);

      audioContext && audioContext.close();
      audioContext = null;
      audioData = [];
      destinationNode.disconnect();
    };
  }

  return (
    <>
      <StyledRecordingButton
        ref={stopBtn}
        onClick={(e) => {
          e.currentTarget.style.display = "none";
          stopRecording();
        }}
        className="stop-btn"
      >
        <div>
          <FaStop />
        </div>
      </StyledRecordingButton>
      <StyledRecordingButton
        ref={startBtn}
        onClick={(e) => {
          e.currentTarget.style.display = "none";
          startRecording();
        }}
        className="start-btn"
      >
        <div>
          <FaMicrophone />
        </div>
      </StyledRecordingButton>
      <StyledRecordingButton ref={loadingBtn} className="loading-btn">
        <div>
          <ClipLoader />
        </div>
      </StyledRecordingButton>
    </>
  );
};

const StyledRecordingButton = styled.button`
  width: 75px;
  height: 75px;
  background-color: #fff;
  border-radius: 100%;
  &.start-btn,
  &.loading-btn {
    & svg {
      color: #333;
    }
  }

  &.loading-btn {
    display: none;
  }

  &.stop-btn {
    display: none;
    & svg {
      color: #ff0000;
    }
  }
`;
