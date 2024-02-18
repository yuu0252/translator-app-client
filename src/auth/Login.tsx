import styled from 'styled-components';
import { UserForm } from '../components/form/UserForm';
import { TypeLoginError, TypeUserForm } from '../type';
import axios from 'axios';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectLogin } from '../reducer/loginSlice';

export const Login = () => {
  const navigate = useNavigate();
  const dispacth = useDispatch();
  const [, setCookie] = useCookies(['token']);
  const [errorMessage, setErrorMessage] = useState('');
  const { isLogin } = useSelector(selectLogin);

  const onSubmit = (data: TypeUserForm) => {
    axios
      .post(import.meta.env.VITE_USER_LOGIN_URL, {
        identifier: data.email,
        password: data.password,
      })
      .then((res) => {
        setCookie('token', res.data.jwt);
        dispacth(login());
        navigate('/');
      })
      .catch((err) => {
        const res = err.response.data.errors;
        const errors: Array<string> = [];
        res.forEach((e: TypeLoginError) => {
          errors.push(e.msg);
        });
        setErrorMessage(errors.join('\n'));
      });
  };

  return (
    <>
      {isLogin ? (
        <Navigate to="/" />
      ) : (
        <StyledLogin className="container">
          {errorMessage !== '' && (
            <p className="error-message">{errorMessage}</p>
          )}
          <UserForm buttonText="ログイン" onSubmit={onSubmit} />
        </StyledLogin>
      )}
    </>
  );
};

const StyledLogin = styled.div`
  display: flex;
  width: 80%;
  min-width: 200px;
  max-width: 400px;
  height: 100vh;
  align-items: center;
  justify-content: center;

  & > p.error-message {
    color: #f08080;
    margin-bottom: 30px;
  }
`;
