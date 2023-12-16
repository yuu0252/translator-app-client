import { FaMicrophone } from 'react-icons/fa6';

export const Recording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });
  return (
    <>
      <button onClick={startRecording}>
        <div>
          <FaMicrophone />
        </div>
      </button>
      <button onClick={stopRecording}>
        <div>Stop</div>
      </button>
    </>
  );
};
