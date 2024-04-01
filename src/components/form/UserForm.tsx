import { useForm } from "react-hook-form";
import { TypeOnSubmitUserForm, TypeUserForm } from "../../type";
import styled from "styled-components";
import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

export const UserForm = ({
  buttonText,
  onSubmit,
}: {
  buttonText: string;
  onSubmit: TypeOnSubmitUserForm;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TypeUserForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  return (
    <StyledUserForm onSubmit={handleSubmit(onSubmit)}>
      <label>メールアドレス</label>
      <input
        type="email"
        {...register("email", {
          required: true,
          pattern: {
            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: "無効なメールアドレスです！",
          },
        })}
      />

      {errors.email?.type === "required" && (
        <p className="error-message">必須項目です！</p>
      )}
      {errors.email?.message && (
        <p className="error-message">{errors.email?.message}</p>
      )}
      <label>パスワード</label>
      <div className="password-input">
        <input
          type={isVisiblePassword ? "text" : "password"}
          {...register("password", { required: true, minLength: 4 })}
        />
        <div onClick={() => setIsVisiblePassword(!isVisiblePassword)}>
          {isVisiblePassword ? <IoMdEyeOff /> : <IoMdEye />}
        </div>
      </div>
      {errors.password?.type === "required" && (
        <p className="error-message">必須項目です！</p>
      )}
      {errors.password?.type === "minLength" && (
        <p className="error-message">4文字以上必要です！</p>
      )}
      <input type="submit" value={buttonText} />
    </StyledUserForm>
  );
};

const StyledUserForm = styled.form`
  & label {
    display: inline-block;
    color: #fff;
    margin: 15px 0 5px;
  }

  & input {
    padding: 10px 15px;
    border-radius: 10px;
    background-color: #fff;
    width: 100%;
  }

  & .password-input {
    position: relative;
    & div {
      position: absolute;
      width: 25px;
      height: 25px;
      top: 50%;
      right: 15px;
      transform: translateY(-50%);
      cursor: pointer;

      & svg {
        color: #555;
        width: 100%;
        height: 100%;
      }
    }
  }

  & input[type="submit"] {
    display: block;
    margin: 75px auto 0;
    width: 150px;
    color: inherit;

    &:hover {
      background-color: #000;
      color: #fff;
    }
  }

  & p.error-message {
    color: #f08080;
    margin-top: 10px;
  }
`;
