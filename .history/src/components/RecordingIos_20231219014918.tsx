import axios from 'axios';

export const RecordingIos = () => {
  // ///////////////////////////////////////////
  // 録音関係
  // ///////////////////////////////////////////

  // 変数定義
  let localMediaStream = null;
  let localScriptProcessor = null;
  let audioSampleRate = null;
  let audioContext = null;
  let bufferSize = 1024;
  let audioData = []; // 録音データ
  let recordingFlg = false;
  let destinationNode;

  // 録音バッファ作成（録音中自動で繰り返し呼び出される）
  function onAudioProcess(e) {
    if (!recordingFlg) return;
    console.log('onAudioProcess');

    // 音声のバッファを作成
    let input = e.inputBuffer.getChannelData(0);
    let bufferData = new Float32Array(bufferSize);
    for (let i = 0; i < bufferSize; i++) {
      bufferData[i] = input[i];
    }
    audioData.push(bufferData);
  }

  // 解析開始
  function startRecording(evt_stream) {
    // 画面アクセス時にマイクを取得
    console.log('startRecording');
    recordingFlg = true;

    // 取得されている音声ストリームの録音を開始
    localMediaStream = evt_stream;

    if (
      !navigator ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      alert('Missing support for navigator.mediaDevices.getUserMedia'); // temp: helps when testing for strange issues on ios/safari
      return;
    }

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    // サンプルレートを保持しておく
    audioSampleRate = audioContext.sampleRate;

    let scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);
    localScriptProcessor = scriptProcessor;

    if (audioContext.createMediaStreamDestination) {
      destinationNode = audioContext.createMediaStreamDestination();
    } else {
      destinationNode = audioContext.destination;
    }

    // safariで Web Audio APIを動かすため、先にaudioContextを生成し、UserMediaを生成する
    return navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        _startRecordingWithStream(stream, destinationNode, scriptProcessor);
      })
      .catch((error) => {
        alert('Error with getUserMedia: ' + error.message); // temp: helps when testing for strange issues on ios/safari
        console.log(error);
      });
  }

  function _startRecordingWithStream(stream, destinationNode, scriptProcessor) {
    // ループ処理のセット
    let mediastreamsource = audioContext.createMediaStreamSource(stream);
    mediastreamsource.connect(scriptProcessor);
    scriptProcessor.onaudioprocess = onAudioProcess;
    console.log(
      'startRecording scriptProcessor.connect(audioContext.destination)'
    );
    scriptProcessor.connect(destinationNode);
  }

  // 解析終了
  function endRecording() {
    console.log('endRecording');
    recordingFlg = false;
    // console.log('audioData');
    // console.log(audioData);

    // console.log('blob = exportWAV(audioData)');
    // 録音できたので録音データをwavにしてinputに配置＆再生ボタンに登録
    let blob = exportWAV(audioData);

    // base64加工
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      const base64data = reader.result;
      // console.log('base64data');

      axios
        .post(
          `${import.meta.env.VITE_SPEECH_TO_TEXT_URL}?key=${
            import.meta.env.VITE_GOOGLE_API_KEY
          }`,
          {
            config: {
              languageCode: 'ja-JP',
              // alternativeLanguageCodes: Object.keys(languageCodeList),
            },
            audio: {
              content: base64data.split(','),
            },
          }
        )
        .then((res) => console.log(res.data));
    };

    let myURL = window.URL || window.webkitURL;
    let url = myURL.createObjectURL(blob);

    // console.log('wavefile');
    // console.log(url);

    // audioタグに録音データをセット

    // audioDataをクリア
    localMediaStream = null;
    localScriptProcessor = null;
    audioContext.close();
    audioContext = null;
    audioData = []; // 録音データ
  }

  // ///////////////////////////////////////////
  // waveファイル作成処理
  // ///////////////////////////////////////////

  function exportWAV(audioData) {
    let encodeWAV = function (samples, sampleRate) {
      let buffer = new ArrayBuffer(44 + samples.length * 2);
      let view = new DataView(buffer);

      let writeString = function (view, offset, string) {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };

      let floatTo16BitPCM = function (output, offset, input) {
        for (let i = 0; i < input.length; i++, offset += 2) {
          let s = Math.max(-1, Math.min(1, input[i]));
          output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        }
      };

      writeString(view, 0, 'RIFF'); // RIFFヘッダ
      view.setUint32(4, 32 + samples.length * 2, true); // これ以降のファイルサイズ
      writeString(view, 8, 'WAVE'); // WAVEヘッダ
      writeString(view, 12, 'fmt '); // fmtチャンク
      view.setUint32(16, 16, true); // fmtチャンクのバイト数
      view.setUint16(20, 1, true); // フォーマットID
      view.setUint16(22, 1, true); // チャンネル数
      view.setUint32(24, sampleRate, true); // サンプリングレート
      view.setUint32(28, sampleRate * 2, true); // データ速度
      view.setUint16(32, 2, true); // ブロックサイズ
      view.setUint16(34, 16, true); // サンプルあたりのビット数
      writeString(view, 36, 'data'); // dataチャンク
      view.setUint32(40, samples.length * 2, true); // 波形データのバイト数
      floatTo16BitPCM(view, 44, samples); // 波形データ

      return view;
    };

    let mergeBuffers = function (audioData) {
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

    // let myURL = window.URL || window.webkitURL;
    // let url = myURL.createObjectURL(audioBlob);
    // return url;
  }
  return (
    <>
      <button onClick={startRecording}>start</button>
      <button onClick={endRecording}>end</button>
    </>
  );
};
