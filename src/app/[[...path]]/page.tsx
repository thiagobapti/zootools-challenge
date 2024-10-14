"use client";

import styled from "styled-components";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import MainSideBar from "../components/MainSideBar";
import DashboardPage from "../components/DashboardPage";
import CampaignsPage from "../components/CampaignsPage";

const Root = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
`;

export default function App() {
  const pathname = usePathname();
  const sidebar = useMemo(() => <MainSideBar />, []);

  return (
    <Root>
      {sidebar}

      {pathname === "/" && <DashboardPage />}
      {pathname === "/campaigns" && <CampaignsPage />}
    </Root>
  );
}
