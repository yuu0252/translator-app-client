import { useRef } from "react";

export const TestRecording = () => {
  const audio = useRef<HTMLAudioElement>(null);
  const playBtn = useRef<HTMLButtonElement>(null);

  let audioContext: AudioContext;
  let audioElement: HTMLAudioElement;

  const onClickAudio = () => {
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
  };

  const onClickPlay = () => {
    if (!audioContext) return;
    console.log("onClickPlay");
    audioContext.state === "suspended" && audioContext.resume();
    console.log(playBtn.dataset);
    if (playBtn.dataset.playing === "false") {
      playBtn.dataset.playing = "true";
    } else if (playBtn.dataset.playing === "true") {
      playBtn.pause();
      playBtn.dataset.playing = "false";
    }
  };

  return (
    <div>
      <audio
        ref={audio}
        onEnded={() => {
          if (playBtn.current) playBtn.current.dataset.playing = "false";
        }}
        src="./myCoolTrack.mp3"
      ></audio>
      <button onClick={onClickAudio} ref={playBtn}>
        audio
      </button>
      <button onClick={onClickPlay}>Play/Pause</button>
    </div>
  );
};
