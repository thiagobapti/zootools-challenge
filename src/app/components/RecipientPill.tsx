import Image from "next/image";
import React, { useCallback } from "react";
import styled, { css } from "styled-components";
import { Contact, ContactGroup } from "../types/general";
import { isContactGroup } from "../util/misc";

const Root = styled.button<{ $themeColor?: string; $clickable?: boolean }>`
  border: 1px solid
    ${(props) =>
      props.$themeColor ? `rgba(${props.$themeColor}, 0.3)` : "#e4e4e7"};
  height: 24px;
  border-radius: 12px;
  padding: 0 1px;
  padding-right: 8px;
  font-size: 12px;
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-top: 6px;
  margin-right: 6px;
  cursor: ${(props) => (props.$clickable ? "pointer" : "default")};
  background: ${(props) =>
    props.$themeColor
      ? `linear-gradient(to right, 
rgba(${props.$themeColor}, 0.05) 0%, 
      rgba(${props.$themeColor}, 0.1) 100%)`
      : "white"};

  &[data-selected="true"] {
    text-decoration: underline;
  }
`;

const AvatarWrapper = styled.div`
  margin-right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TagIcon = styled.div<{ $themeColor?: string }>`
  width: 8px;
  height: 8px;
  margin: 0 8px;
  border-radius: 50%;
  border: 1px solid ${(props) => `rgba(${props.$themeColor}, 1)`};
  background: ${(props) =>
    `linear-gradient(
        to right,
        rgba(${props.$themeColor}, 0.5) 0%,
        rgba(${props.$themeColor}, 0.8) 100%
      )`};
`;

interface RecipientPillProps {
  recipient: Contact | ContactGroup;
  selected?: boolean;
  title?: string;
  clickHandler?: (recipient: Contact | ContactGroup) => void;
  tabIndex?: number;
}

const RecipientPill: React.FC<RecipientPillProps> = ({
  recipient,
  selected,
  clickHandler,
  title,
  tabIndex,
}) => {
  const handleClick = useCallback(() => {
    clickHandler?.(recipient);
  }, [clickHandler, recipient]);

  return (
    <Root
      data-selected={selected}
      title={title}
      $themeColor={isContactGroup(recipient) ? recipient.themeColor : undefined}
      onClick={handleClick}
      $clickable={clickHandler !== undefined}
      tabIndex={tabIndex}
    >
      {isContactGroup(recipient) ? (
        <>
          <TagIcon $themeColor={recipient.themeColor} />
          {recipient.label} ({recipient.contacts.length})
        </>
      ) : (
        <>
          <AvatarWrapper>
            <Image
              src={`https://api.dicebear.com/9.x/personas/svg?seed=${recipient.id}&radius=50&translateY=-10`}
              alt="User"
              width={20}
              height={20}
            />
          </AvatarWrapper>
          {recipient.email}
        </>
      )}
    </Root>
  );
};

export default RecipientPill;
