import styled from 'styled-components';

export const Login = () => {
  return (
    <>
      <StyledLogin className="container">
        <h2>ログイン</h2>
      </StyledLogin>
    </>
  );
};

const StyledLogin = styled.div`
  width: 30%;
  min-width: 200px;
  height: 50vh;
  background-color: #fff;
`;
