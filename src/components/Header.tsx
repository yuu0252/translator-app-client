import { useSelector } from 'react-redux';
import { languageCodeList } from '../constants';
import { selectLanguage, setCurrentLanguage } from '../reducer/languageSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Header = () => {
  const dispatch = useDispatch();
  const language = useSelector(selectLanguage);

  const currentLanguage = language.currentLanguage;

  return (
    <StyledHeader id="header">
      <div className="header-link">
        <Link to="/">
          <span>Home</span>
        </Link>
        <Link to="/image">
          <span>Image</span>
        </Link>
      </div>
      <div className="select-box">
        <select
          value={currentLanguage}
          onChange={(e) => dispatch(setCurrentLanguage(e.target.value))}
        >
          <option key="default" value="none">
            {'言語を選択してください'}
          </option>
          {languageCodeList.map((language) => (
            <option value={language.code} key={language.code}>
              {language.name}
            </option>
          ))}
        </select>
      </div>
    </StyledHeader>
  );
};

const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  max-width: 1000px;
  height: 120px;
  padding: 0 30px;
  margin: 0 auto;

  & .header-link {
    height: 50px;
    display: flex;
    column-gap: 5px;
    align-items: center;
    & > a {
      display: flex;
      height: 100%;
      align-items: center;
      background-color: #fff;
      padding: 5px 15px;
      border-radius: 0 0 5px 5px;
      border: 3px solid #333;
      text-decoration: none;
      color: #555;
    }
  }
  & .select-box {
    width: fit-content;
    height: 50px;
    position: relative;
    margin: 0 0 0 auto;
    &::before {
      content: '';
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 7px 7px 0 7px;
      border-color: #555 transparent transparent transparent;
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      pointer-events: none;
    }

    select {
      height: 100%;
      color: #333;
      background-color: #fff;
      padding: 0 30px;
      border-radius: 5px;

      & > option {
        text-align: center;
      }
    }
  }
`;
