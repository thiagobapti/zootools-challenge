"use client";

import React, { useCallback, useLayoutEffect } from "react";
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
} from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import { storageKeys } from "../util/storage";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 22px;
  border-right: 1px solid #d7d7d7;
  position: relative;
`;

const Logo = styled(Image)`
  cursor: pointer;
`;

const LogoName = styled(Image)`
  cursor: pointer;
  margin-left: 12px;
`;

const NavLink = styled.button<{ $active?: boolean; $open: boolean }>`
  width: ${(props) => (props.$open ? "200px" : "40px")};
  border: none;
  margin-bottom: 6px;
  height: 36px;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${(props) => (props.$open ? "flex-start" : "center")};
  padding-left: ${(props) => (props.$open ? "14px" : "0")};
  background-color: ${(props) => (props.$active ? "#a121d3" : "#efefef")};
  color: ${(props) => (props.$active ? "#fff" : "#454545")};
  cursor: pointer;
  overflow: hidden;
`;

const CollapsibleContent = styled.div<{
  $open: boolean;
  $animatedSidebar: boolean;
}>`
  width: ${(props) => (props.$open ? "200px" : "40px")};
  overflow: hidden;
  transition: width ${(props) => (props.$animatedSidebar ? "0.3s ease" : "0")};
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  margin-top: 32px;
`;

const NavIcon = styled(FontAwesomeIcon)<{
  $active?: boolean;
  $open: boolean;
}>`
  margin-right: ${(props) => (props.$open ? "10px" : "0")};
  width: 18px;
  height: 18px;
  color: ${(props) => (props.$active ? "#fff" : "#454545")};
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleButton = styled.button`
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

const ToggleIcon = styled(FontAwesomeIcon)<{ open: boolean }>`
  width: 8px;
  height: 8px;
  transform: ${(props) => (props.open ? "rotate(180deg)" : "rotate(0)")};
  transition: transform 0.3s ease 0.3s;
  color: #454545;
`;

const MainSideBar: React.FC = () => {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(true);
  const [animatedSidebar, setAnimatedSidebar] = React.useState(false);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const mainNavExpanded = window.sessionStorage.getItem(
      storageKeys.mainNav.expanded
    );
    const mainNavTouched = window.sessionStorage.getItem(
      storageKeys.mainNav.touched
    );
    const initialAnimation = window.sessionStorage.getItem(
      storageKeys.mainNav.initialAnimation
    );

    if (initialAnimation && mainNavExpanded !== "true") {
      setOpen(false);
      window.sessionStorage.setItem(storageKeys.mainNav.expanded, "false");
    }

    if ((!mainNavExpanded || mainNavExpanded === "false") && mainNavTouched) {
      const timeoutId = window.setTimeout(() => {
        window.sessionStorage.setItem(
          storageKeys.mainNav.initialAnimation,
          "true"
        );
        setAnimatedSidebar(true);
        setOpen(false);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, []);

  const handleToggle = useCallback(() => {
    setAnimatedSidebar(true);
    setOpen((prevOpen) => {
      const newOpen = !prevOpen;
      window.sessionStorage.setItem(
        storageKeys.mainNav.expanded,
        newOpen.toString()
      );
      return newOpen;
    });
  }, []);

  const handleLinkClick = React.useCallback(() => {
    window.sessionStorage.setItem(storageKeys.mainNav.touched, "true");
  }, []);

  return (
    <Root>
      <ToggleButton
        onClick={handleToggle}
        title={open ? "Collapse sidebar" : "Expand sidebar"}
        aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
      >
        <ToggleIcon icon={faChevronRight} open={open} />
      </ToggleButton>
      <LogoWrapper>
        <Logo
          src={zooToolsLogoMinSvg}
          role="button"
          alt="ZooTools Logo"
          width={40}
          onClick={handleToggle}
          title={open ? "Collapse sidebar" : "Expand sidebar"}
        />
        {open && (
          <LogoName
            src={zooToolsLogoNameSvg}
            alt="ZooTools Logo"
            height={20}
            title={open ? "Collapse sidebar" : "Expand sidebar"}
            onClick={handleToggle}
          />
        )}
      </LogoWrapper>
      <CollapsibleContent $open={open} $animatedSidebar={animatedSidebar}>
        <Link href="/" passHref onClick={handleLinkClick}>
          <NavLink $active={pathname === "/"} $open={open}>
            <NavIcon
              icon={faChartSimple}
              $active={pathname === "/"}
              $open={open}
            />
            {open && "Dashboard"}
          </NavLink>
        </Link>
        <Link href="/campaigns" passHref onClick={handleLinkClick}>
          <NavLink $active={pathname === "/campaigns"} $open={open}>
            <NavIcon
              icon={faEnvelope}
              $active={pathname === "/campaigns"}
              $open={open}
            />
            {open && "Campaigns"}
          </NavLink>
        </Link>
      </CollapsibleContent>
    </Root>
  );
};

export default MainSideBar;
