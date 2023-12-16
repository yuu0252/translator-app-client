export const Recording = () => {
  return (
    <>
      {' '}
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
