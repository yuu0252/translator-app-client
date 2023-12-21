import { useSelector } from 'react-redux';
import { languageCodeList } from '../constants';
import { selectLanguage, setLanguage } from '../reducer/languageSlice';
import { useDispatch } from 'react-redux';

export const Header = () => {
  const dispatch = useDispatch();
  const language = useSelector(selectLanguage);
  console.log(language);
  return (
    <div id="header">
      <div className="select-box">
        <select
          value={language.language}
          onChange={(e) => dispatch(setLanguage(e.target.value))}
        >
          <option key="default">{'言語を選択してください'}</option>
          {languageCodeList.map((language) => (
            <option value={language.code} key={language.code}>
              {language.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
