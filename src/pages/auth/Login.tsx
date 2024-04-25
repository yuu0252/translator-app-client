import styled from "styled-components";
import { UserForm } from "../../components/form/UserForm";
import { TypeLoginError, TypeUserForm } from "../../type";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { login, selectLogin } from "../../reducer/loginSlice";
import { axiosFetchServer } from "../../api/axiosFetchServer";

export const Login = () => {
  const navigate = useNavigate();
  const dispacth = useDispatch();
  const [, setCookie] = useCookies(["token"]);
  const [errorMessage, setErrorMessage] = useState("");
  const { isLogin } = useSelector(selectLogin);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data: TypeUserForm) => {
    // ローディングボタンのロードをTrueにする
    setIsLoading(true);
    // ログインに成功すればホームへ
    // 失敗すればエラーメッセージをステートにセットする
    axiosFetchServer
      .post("/login", {
        email: data.email,
        password: data.password,
      })
      .then((res) => {
        setCookie("token", res.data.token, { maxAge: 2592000 });
        dispacth(login());
        // ログイン成功後ホームへ
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        const res = err.response.data.errors;
        const errors: Array<string> = [];
        res.forEach((e: TypeLoginError) => {
          errors.push(e.msg);
        });
        setErrorMessage(errors.join("\n"));
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      {isLogin ? (
        <Navigate to="/" />
      ) : (
        <StyledLogin className="container">
          <h1 className="serif">Multi Translator</h1>
          {errorMessage !== "" && (
            <p className="error-message">{errorMessage}</p>
          )}
          <UserForm
            buttonText="ログイン"
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
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

  & h1 {
    margin-bottom: 30px;
    color: #fff;
    text-shadow: #aaa 0 0 15px;
    letter-spacing: 0.125em;
  }

  & > p.error-message {
    color: #f08080;
    margin-bottom: 30px;
  }
`;
