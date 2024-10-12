import * as Tabs from "@radix-ui/react-tabs";
import React from "react";
import styled from "styled-components";

const StyledMainHeader = styled.div`
  height: 70px;
  background-color: #fff;
  border-bottom: 1px solid #848484;
`;

const MainHeader: React.FC = () => {
  return <StyledMainHeader></StyledMainHeader>;
};

export default MainHeader;
