import { languageCode } from '../constants';

export const Header = () => {
  return (
    <div id="header">
      <div className="select-box">
        <select>
          <option key="default"></option>
          {Object.values(languageCode).map((value) => (
            <option key={value.code}>{value.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
