import { useEffect, useRef } from 'react';

export const TestRecording = () => {
  const audio = useRef<HTMLAudioElement>(null);
  const playBtn = useRef<HTMLButtonElement>(null);

  let audioContext: AudioContext;
  let audioElement: HTMLAudioElement;

  useEffect(() => {
    if (audioContext) return;
    let track;
    const AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;

    audioContext = new AudioContext();

    if (!audio.current) return;
    audioElement = audio.current && audio.current;

    track = audioElement && audioContext.createMediaElementSource(audioElement);

    console.log(audioContext);
    console.log(audioElement);
    console.log(track);

    track.connect(audioContext.destination);
  }, []);

  const onClickPlay = () => {
    if (!audioContext) return;
    console.log('onClickPlay');
    audioContext.state === 'suspended' && audioContext.resume();
    console.log(audioElement.dataset.playing);
    if (audioElement.dataset.playing === 'false') {
      audioElement.dataset.playing = 'true';
      console.log(audioElement.dataset.playing);
    } else if (audioElement.dataset.playing === 'true') {
      audioElement.pause();
      audioElement.dataset.playing = 'false';
      console.log(audioElement.dataset.playing);
    }
  };

  return (
    <div>
      <audio
        ref={audio}
        onEnded={() => {
          if (playBtn.current) playBtn.current.dataset.playing = 'false';
        }}
        src="./myCoolTrack.mp3"
      ></audio>
      <button onClick={onClickPlay}>Play/Pause</button>
    </div>
  );
};
