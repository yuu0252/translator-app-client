import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { logout } from '../reducer/loginSlice';
import { useNavigate } from 'react-router';

export const Logout = () => {
  const [, , removeCookie] = useCookies(['token']);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onClickLogout = () => {
    removeCookie('token');
    dispatch(logout());
    navigate('/login');
  };

  return <button onClick={onClickLogout}>o</button>;
};
