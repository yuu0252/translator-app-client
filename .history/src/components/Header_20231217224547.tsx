import { useSelector } from 'react-redux';
import { languageCode } from '../constants';
import { selectLanguage, setLanguage } from '../languageSlice';
import { useDispatch } from 'react-redux';

export const Header = () => {
  const dispatch = useDispatch();
  const language = useSelector(selectLanguage);
  console.log(language.language);
  return (
    <div id="header">
      <div className="select-box">
        <select
          value={language}
          onChange={(e) => dispatch(setLanguage(e.target.value))}
        >
          <option key="default">{'言語を選択してください'}</option>
          {Object.entries(languageCode).map(([key, value]) => (
            <option value={value.name} key={key}>
              {value.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
