"use client";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import styled from "styled-components";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useEffect, useMemo, useState } from "react";
import zooToolsLogoMinSvg from "../images/zootools-logo-min.svg";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import MainSideBar from "../components/MainSideBar";
import DashboardPage from "../components/DashboardPage";
import CampaignsPage from "../components/CampaignsPage";

const StyledAppRoot = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
`;

export default function App() {
  // const editor = useCreateBlockNote();

  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const [open2, setOpen2] = useState(false);

  const sidebar = useMemo(() => <MainSideBar />, []);

  return (
    <StyledAppRoot>
      {sidebar}

      {pathname === "/" && <DashboardPage />}
      {pathname === "/campaigns" && <CampaignsPage />}
    </StyledAppRoot>
  );
}
