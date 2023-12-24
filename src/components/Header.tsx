import { useSelector } from 'react-redux';
import { languageCodeList } from '../constants';
import { selectLanguage, setLanguage } from '../reducer/languageSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export const Header = () => {
  const dispatch = useDispatch();
  const language = useSelector(selectLanguage);
  console.log(language);
  return (
    <div id="header">
      <div className="header-link">
        <Link to="/">Home</Link>
        <Link to="/calculator">Calculator</Link>
        <Link to="/recorder">Recorder</Link>
      </div>
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
