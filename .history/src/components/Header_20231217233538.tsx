import { useSelector } from 'react-redux';
import { languageCodeList } from '../constants';
import { selectLanguage, setLanguage } from '../languageSlice';
import { useDispatch } from 'react-redux';

export const Header = () => {
  const dispatch = useDispatch();
  const language = useSelector(selectLanguage);
  return (
    <div id="header">
      <div className="select-box">
        <select
          value={language.language}
          onChange={(e) => dispatch(setLanguage(e.target.value))}
        >
          <option key="default">{'言語を選択してください'}</option>
          {Object.entries(languageCodeList).map(([key, value]) => (
            <option value={key} key={key}>
              {value.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
