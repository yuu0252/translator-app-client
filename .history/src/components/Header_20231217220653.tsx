export const Header = () => {
  return (
    <div className="select-box">
      <select>
        <option key="default"></option>
        {Object.entries(languageCode).map(([key, value]) => (
          <option key={key}>{`${key}(${value})`}</option>
        ))}
      </select>
    </div>
  );
};
