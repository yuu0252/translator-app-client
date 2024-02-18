import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { logout } from '../reducer/loginSlice';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

export const Logout = () => {
  const [, , removeCookie] = useCookies(['token']);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onClickLogout = () => {
    removeCookie('token');
    dispatch(logout());
    navigate('/login');
  };

  return (
    <StyledLogout id="logout-btn" onClick={onClickLogout}>
      Logout
    </StyledLogout>
  );
};

const StyledLogout = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: transparent;
  padding: 0;
  & svg {
    width: 10px;
    color: #555;
    height: 100%;
  }
`;
