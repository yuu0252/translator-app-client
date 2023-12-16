export const Recording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const { status, startRecording, stopRecording, mediaBlobUrl } =
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
