"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import zooToolsLogoMinSvg from "../images/zootools-logo-min.svg";
import zooToolsLogoNameSvg from "../images/zootools-logo-name.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faChevronRight,
  faEnvelope,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";

const StyledRoot = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 22px;
  border-right: 1px solid #d7d7d7;
  position: relative;
`;

const StyledSidebarLogo = styled(Image)`
  cursor: pointer;
`;

const StyledSidebarLogoName = styled(Image)`
  cursor: pointer;
  margin-left: 12px;
`;

const SidebarButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean; open: boolean }>`
  width: ${(props) => (props.open ? "200px" : "40px")};
  border: none;
  margin-bottom: 6px;
  height: 36px;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${(props) => (props.open ? "flex-start" : "center")};
  padding-left: ${(props) => (props.open ? "14px" : "0")};
  background-color: ${(props) => (props.active ? "#a121d3" : "#efefef")};
  color: ${(props) => (props.active ? "#fff" : "#454545")};
  cursor: pointer;
  overflow: hidden;
  transition: width 0.3s ease;
`;

const CollapsibleContent = styled.div<{ open: boolean }>`
  width: ${(props) => (props.open ? "200px" : "40px")};
  overflow: hidden;
  transition: width 0.3s ease;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  margin-top: 32px;
`;

const SidebarIcon = styled(FontAwesomeIcon).withConfig({
  shouldForwardProp: (prop) => prop !== "active",
})<{
  active?: boolean;
  open: boolean;
}>`
  margin-right: ${(props) => (props.open ? "10px" : "0")};
  width: 18px;
  height: 18px;
  color: ${(props) => (props.active ? "#fff" : "#454545")};
`;

const StyledLogoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledToggleButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  background-color: #efefef;
  border-radius: 50%;
  position: absolute;
  right: -10px;
  top: 26px;
  width: 18px;
  height: 18px;
  border: 1px solid #d7d7d7;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledToggleIcon = styled(FontAwesomeIcon)<{ open: boolean }>`
  width: 8px;
  height: 8px;
  transform: ${(props) => (props.open ? "rotate(180deg)" : "rotate(0)")};
  transition: transform 0.3s ease 0.3s;
  color: #454545;
`;

const MainSideBar: React.FC = () => {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedValue = window.sessionStorage.getItem("sidebarOpen");
      setOpen(storedValue !== "false");
    }
  }, []);

  const handleToggle = React.useCallback(() => {
    setOpen((prevOpen) => {
      const newOpen = !prevOpen;
      window.sessionStorage.setItem("sidebarOpen", newOpen.toString());
      return newOpen;
    });
  }, []);

  const handleLinkClick = React.useCallback(() => {
    setOpen(false);
    window.sessionStorage.setItem("sidebarOpen", "false");
  }, []);

  return (
    <StyledRoot>
      <StyledToggleButton
        onClick={handleToggle}
        title={open ? "Collapse sidebar" : "Expand sidebar"}
        aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
      >
        <StyledToggleIcon icon={faChevronRight} open={open} />
      </StyledToggleButton>
      <StyledLogoWrapper>
        <StyledSidebarLogo
          src={zooToolsLogoMinSvg}
          role="button"
          alt="ZooTools Logo"
          width={40}
          onClick={handleToggle}
          title={open ? "Collapse sidebar" : "Expand sidebar"}
        />
        {open && (
          <StyledSidebarLogoName
            src={zooToolsLogoNameSvg}
            alt="ZooTools Logo"
            height={20}
            title={open ? "Collapse sidebar" : "Expand sidebar"}
            onClick={handleToggle}
          />
        )}
      </StyledLogoWrapper>
      <CollapsibleContent open={open}>
        <Link href="/" passHref onClick={handleLinkClick}>
          <SidebarButton active={pathname === "/"} open={open}>
            <SidebarIcon
              icon={faChartSimple}
              active={pathname === "/"}
              open={open}
            />
            {open && "Dashboard"}
          </SidebarButton>
        </Link>
        <Link href="/campaigns" passHref onClick={handleLinkClick}>
          <SidebarButton active={pathname === "/campaigns"} open={open}>
            <SidebarIcon
              icon={faEnvelope}
              active={pathname === "/campaigns"}
              open={open}
            />
            {open && "Campaigns"}
          </SidebarButton>
        </Link>
      </CollapsibleContent>
    </StyledRoot>
  );
};

export default MainSideBar;
