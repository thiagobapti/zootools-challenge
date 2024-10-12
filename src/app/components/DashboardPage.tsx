import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const StyledContent = styled.div`
  width: 100%;
  flex: 1;
  background-color: #fff;
  height: 100%;
`;

const DashboardPage: React.FC = () => {
  return (
    <StyledContainer>
      <StyledContent>DashboardPage</StyledContent>
    </StyledContainer>
  );
};

export default DashboardPage;
