import React from "react";
import styled from "styled-components";
import MainHeader from "./MainHeader";

const StyledSidebar = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 22px;
  border-right: 1px solid #848484;
`;

const CollapsibleContent = styled.div<{ open: boolean }>`
  width: ${(props) => (props.open ? "200px" : "0")};
  overflow: hidden;
  transition: width 0.3s ease;
  background-color: lightgray;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  margin-top: 16px;
`;

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

const CampaignsPage: React.FC = () => {
  const [open, setOpen] = React.useState(true);

  return (
    <>
      <StyledSidebar>
        <CollapsibleContent open={open}>@</CollapsibleContent>
      </StyledSidebar>
      <StyledContainer>
        <MainHeader />
        <StyledContent>CampaignsPage</StyledContent>
      </StyledContainer>
    </>
  );
};

export default CampaignsPage;
