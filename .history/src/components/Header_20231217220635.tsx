export const Header = () => {
  return (
    <div className="select-box">
      <select>
        <option key="default">{language}</option>
        {Object.entries(languageList).map(([key, value]) => (
          <option key={key}>{`${key}(${value})`}</option>
        ))}
      </select>
    </div>
  );
};
