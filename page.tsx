"use client";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import styled from "styled-components";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useState } from "react";
import zooToolsLogoMinSvg from "./images/zootools-logo-min.svg";
import Image from "next/image";
import { usePathname } from "next/navigation";

const StyledAppRoot = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
`;

const StyledContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const StyledHeader = styled.div`
  height: 70px;
  background-color: red;
`;

const StyledContent = styled.div`
  width: 100%;
  flex: 1;
  background-color: blue;
  height: 100%;
`;

//
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

const StyledSidebarLogo = styled(Image)`
  cursor: pointer;
`;

const StyledSidebarButton = styled.button`
  width: 200px;

  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;
//

export default function App() {
  // const editor = useCreateBlockNote();

  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const [open2, setOpen2] = useState(false);

  return (
    <StyledAppRoot>
      <StyledSidebar>
        <StyledSidebarLogo
          src={zooToolsLogoMinSvg}
          role="button"
          alt="ZooTools Logo"
          height={54}
          onClick={() => setOpen(!open)}
          title={open ? "Collapse sidebar" : "Expand sidebar"}
        />
        <CollapsibleContent open={open}>
          <StyledSidebarButton>Dashboard</StyledSidebarButton>
          <StyledSidebarButton>Campaigns</StyledSidebarButton>
        </CollapsibleContent>
      </StyledSidebar>
      <Collapsible.Root open={open2} onOpenChange={setOpen2}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span className="Text" style={{ color: "white" }}>
            @peduarte starred 3 repositories
          </span>
          <Collapsible.Trigger asChild>
            <button className="IconButton">open/close</button>
          </Collapsible.Trigger>
        </div>

        <div className="Repository">
          <span className="Text">@radix-ui/primitives</span>
        </div>

        <Collapsible.Content>
          <div className="Repository">
            <span className="Text">@radix-ui/colors</span>
          </div>
          <div className="Repository">
            <span className="Text">@radix-ui/themes</span>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
      <StyledContainer>
        <StyledHeader></StyledHeader>
        <StyledContent>
          {pathname === "/" && <div>Dashboard</div>}
          {pathname === "/campaigns" && <div>Campaigns</div>}
          hello
          {/* <BlockNoteView editor={editor} /> */}
          {/* <Text>Hello from Radix Themes :)</Text>
        <Button>Lets go</Button> */}
        </StyledContent>
      </StyledContainer>
    </StyledAppRoot>
  );
}
