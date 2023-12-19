export const Canvas = () => {
  return (
    <div>
      <h3>画像生成</h3>
      <h4>生成</h4>
      {png && (
        <div className="comp" style={{ display: 'flex' }}>
          <img alt="icon" src={png} />
          <img alt="round icon" src={png} style={{ borderRadius: '100%' }} />
        </div>
      )}
    </div>
  );
};
