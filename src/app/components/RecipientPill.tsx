import * as Tabs from "@radix-ui/react-tabs";
import Image from "next/image";
import React from "react";
import styled from "styled-components";
import { Contact, ContactGroup } from "../types/general";

const Root = styled.div<{ $themeColor?: string }>`
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
  background: ${(props) =>
    props.$themeColor
      ? `linear-gradient(to right, 
rgba(${props.$themeColor}, 0.05) 0%, 
      rgba(${props.$themeColor}, 0.1) 100%)`
      : "white"};
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

const RecipientPill: React.FC<{ recipient: Contact | ContactGroup }> = ({
  recipient,
}) => {
  const isContactGroup = (
    recipient: Contact | ContactGroup
  ): recipient is ContactGroup => {
    return (recipient as ContactGroup).label !== undefined;
  };

  return (
    <Root
      $themeColor={isContactGroup(recipient) ? recipient.themeColor : undefined}
    >
      {isContactGroup(recipient) ? (
        <>
          <TagIcon $themeColor={recipient.themeColor} />
          {recipient.label}
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
