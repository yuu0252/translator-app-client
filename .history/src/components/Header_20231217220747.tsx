import { languageCode } from '../constants';

export const Header = () => {
  return (
    <div className="select-box">
      <select>
        <option key="default"></option>
        {Object.values(languageCode).map(value) => (
          <option key={key}>{`${key}(${value})`}</option>
        ))}
      </select>
    </div>
  );
};
