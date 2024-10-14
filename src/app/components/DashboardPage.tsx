import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
} from "@fortawesome/free-solid-svg-icons";

const Root = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  line-height: 1.5;
`;

const DashboardPage: React.FC = () => {
  return (
    <Root>
      <FontAwesomeIcon icon={faChartSimple} size="2xl" />
      This will be an amazing Dashboard
      <br />
      at some point :)
    </Root>
  );
};

export default DashboardPage;
