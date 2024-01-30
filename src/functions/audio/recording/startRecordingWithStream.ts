export const startRecordingWithStream = (
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
    console.log('onAudioProcess');

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
};
