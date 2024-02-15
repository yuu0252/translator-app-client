import { useForm } from 'react-hook-form';
import { TypeUserForm } from '../../type';
import styled from 'styled-components';

export const UserForm = ({ buttonText }: { buttonText: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TypeUserForm>({
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const onSubmit = (data: TypeUserForm) => console.log(data);

  return (
    <StyledUserForm onSubmit={handleSubmit(onSubmit)}>
      <label>ユーザ名</label>
      <input type="text" {...register('username', { required: true })} />
      {errors.username && <span>必須項目です！</span>}
      <label>パスワード</label>
      <input type="password" {...register('password', { required: true })} />
      {errors.password && <span>必須項目です！</span>}
      <input type="submit" value={buttonText} />
    </StyledUserForm>
  );
};

const StyledUserForm = styled.form`
  margin: auto 0;

  & label {
    display: inline-block;
    color: #fff;
    margin-bottom: 5px;
  }

  & input {
    padding: 10px 15px;
    border-radius: 10px;
    background-color: #fff;
    margin-bottom: 15px;
    width: 100%;
  }

  & input[type='submit'] {
    display: block;
    margin: 30px auto 0;
    width: 150px;

    &:hover {
      background-color: #000;
      color: #fff;
    }
  }
`;
