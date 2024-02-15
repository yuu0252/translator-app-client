import styled from 'styled-components';
import { UserForm } from '../components/form/UserForm';

export const Login = () => {
  return (
    <>
      <StyledLogin className="container">
        <UserForm buttonText="ログイン" />
      </StyledLogin>
    </>
  );
};

const StyledLogin = styled.div`
  width: 80%;
  min-width: 200px;
  max-width: 400px;
  height: 100vh;
`;
