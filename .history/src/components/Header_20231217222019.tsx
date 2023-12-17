import { languageCode } from '../constants';

export const Header = () => {
  return (
    <div id="header">
      <div className="select-box">
        <select>
          <option key="default">{'言語を選択してください'}</option>
          {Object.values(languageCode).map((value) => (
            <option key={value.name}>{value.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
