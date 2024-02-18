import { useSelector } from 'react-redux';
import { languageCodeList } from '../constants';
import { selectLanguage, setCurrentLanguage } from '../reducer/languageSlice';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Logout } from '../auth/Logout';

export const Header = () => {
  const dispatch = useDispatch();
  const language = useSelector(selectLanguage);

  const currentLanguage = language.currentLanguage;

  const pathname = useLocation().pathname;

  return (
    <StyledHeader id="header">
      <nav className="header-link">
        <ul>
          <li className={pathname === '/' ? 'home active' : 'home'}>
            <Link to="/">
              <span>Home</span>
            </Link>
          </li>
          <li className={pathname === '/image' ? 'image active' : 'image'}>
            <Link to="/image">
              <span>Image</span>
            </Link>
          </li>
          <li
            className={
              pathname === '/favorite' ? 'favorite active' : 'favorite'
            }
          >
            <Link to="/favorite">
              <span>Favorite</span>
            </Link>
          </li>
          <li>
            <Logout />
          </li>
        </ul>
      </nav>
      <div className="select-box">
        <select
          value={currentLanguage}
          onChange={(e) => dispatch(setCurrentLanguage(e.target.value))}
        >
          <option key="default" value="none">
            {'言語を選択してください'}
          </option>
          <optgroup label="全ての言語">
            {languageCodeList.map((language) => (
              <option value={language.code} key={language.code}>
                {language.name}
              </option>
            ))}
          </optgroup>
        </select>
      </div>
    </StyledHeader>
  );
};

const StyledHeader = styled.div`
  position: relative;
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
    & ul {
      display: flex;
      height: 100%;
      column-gap: 5px;
      align-items: center;
      & li {
        width: 100px;
        height: 100%;
        padding: 5px 15px;
        border-radius: 0 0 5px 5px;
        border: 3px solid #333;
        color: #555;
        background-color: #fff;
        &.active {
          color: #fff;
          background-color: #555;
        }
        &:last-of-type {
          margin-right: 0;
          margin-left: auto;
          &:hover {
            color: #fff;
            background-color: #555;
          }
        }
        & a {
          display: flex;
          height: 100%;
          justify-content: center;
          align-items: center;
        }
      }
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
