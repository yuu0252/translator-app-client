import { ClockLoader } from 'react-spinners';
import styled from 'styled-components';

export const Loading = () => {
  return (
    <StyledLoading>
      <ClockLoader />
      <p>Loading</p>
    </StyledLoading>
  );
};

const StyledLoading = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 15px;
  width: 100%;
`;
