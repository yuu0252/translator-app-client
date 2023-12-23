import { useRef } from 'react';

export const TestRecording = () => {
  const audio = useRef(null);

  let track;
  const AudioContext =
    window.AudioContext || (window as any).webkitAudioContext;

  const audioContext = new AudioContext();

  if (!audio.current) return;
  const audioElement: HTMLAudioElement = audio.current && audio.current;

  track = audioElement && audioContext.createMediaElementSource(audioElement);

  console.log(audioContext);
  console.log(audioElement);
  console.log(track);
  return (
    <div>
      <audio ref={audio} src="./myCoolTrack.mp3"></audio>
    </div>
  );
};
