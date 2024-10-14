import * as Tabs from "@radix-ui/react-tabs";
import Image from "next/image";
import React, { useCallback } from "react";
import styled from "styled-components";
import { Contact, ContactGroup } from "../types/general";
import * as Dialog from "@radix-ui/react-dialog";
import RecipientPill from "./RecipientPill";
import { contactGroups } from "../data/database";

const Root = styled(Dialog.Root)``;

const StyledOverlay = styled(Dialog.Overlay)`
  background-color: rgba(0, 0, 0, 0.15);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const StyledContent = styled(Dialog.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 600px;
  max-width: fit-content;
  max-height: 85vh;
  padding: 20px;
  margin-top: -5vh;
  background-color: white;
  border-radius: 6px;

  &:focus {
    outline: none;
  }
`;

const AvatarWrapper = styled.div`
  margin-right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TagIcon = styled.div<{ $themeColor?: string }>`
  width: 12px;
  height: 12px;
  margin-right: 8px;
  border-radius: 50%;
  border: 1px solid ${(props) => `rgba(${props.$themeColor}, 1)`};
  background: ${(props) =>
    `linear-gradient(
        to right,
        rgba(${props.$themeColor}, 0.5) 0%,
        rgba(${props.$themeColor}, 0.8) 100%
      )`};
`;

const ContactList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const StatisticsTable = styled.div`
  display: table;
  width: 100%;
`;

const StatisticsRow = styled.div`
  display: table-row;
`;

const StatisticsCell = styled.div`
  display: table-cell;
  padding: 8px;
  border-bottom: 1px solid #ddd;
`;

const DialogTitle = styled(Dialog.Title)`
  display: flex;
  align-items: center;
  flex-direction: row;
`;

const Label = styled.div<{ $marginTop?: string }>`
  font-weight: bold;
  margin-top: ${(props) => props.$marginTop || "0"};
  font-size: 14px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
`;

const RemoveButton = styled.button`
  background-color: #c50d0d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
`;

const CloseButton = styled(Dialog.Close)`
  background-color: #d5d5d5;
  color: #000;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
`;
const InfoRow = styled.div`
  display: flex;
  align-items: center;

  &:nth-child(n + 2) {
    margin-top: 6px;
  }
`;

const InfoLabel = styled(Label)`
  margin-right: 8px;
`;

const InfoTable = styled.div`
  display: table;
  width: 100%;
  margin-top: 22px;
`;

const RecipientDetailDialog: React.FC<{
  recipient: Contact | ContactGroup;
  closeHandler: () => void;
  removeHandler: (recipient: Contact | ContactGroup) => void;
}> = ({ recipient, closeHandler, removeHandler }) => {
  const isContactGroup = (
    recipient: Contact | ContactGroup
  ): recipient is ContactGroup => {
    return (recipient as ContactGroup).label !== undefined;
  };

  const renderStatistics = () => (
    <StatisticsTable>
      <StatisticsRow>
        <StatisticsCell> Campaigns Sent:</StatisticsCell>
        <StatisticsCell>{recipient.campaignsSent}</StatisticsCell>
      </StatisticsRow>
      <StatisticsRow>
        <StatisticsCell>Open Rate:</StatisticsCell>
        <StatisticsCell>{recipient.openRate.toFixed(2)}%</StatisticsCell>
      </StatisticsRow>
      <StatisticsRow>
        <StatisticsCell>Click Rate:</StatisticsCell>
        <StatisticsCell>{recipient.clickRate.toFixed(2)}%</StatisticsCell>
      </StatisticsRow>
      <StatisticsRow>
        <StatisticsCell>Bounce Rate:</StatisticsCell>
        <StatisticsCell>{recipient.bounceRate.toFixed(2)}%</StatisticsCell>
      </StatisticsRow>
    </StatisticsTable>
  );

  const groups = contactGroups.filter((group) =>
    group.contacts.some((contact) => contact.id === recipient.id)
  );

  return (
    <Root open>
      <StyledOverlay />
      <StyledContent>
        <DialogTitle>
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
                  width={32}
                  height={32}
                />
              </AvatarWrapper>
              {recipient.name}
            </>
          )}
        </DialogTitle>
        {isContactGroup(recipient) ? (
          <>
            <Label $marginTop="22px">
              Contacts ({recipient.contacts.length})
            </Label>
            <ContactList>
              {recipient.contacts.map((contact) => (
                <RecipientPill
                  recipient={contact}
                  key={contact.id}
                  clickHandler={() => {}}
                />
              ))}
            </ContactList>
            <Label $marginTop="22px">Statistics</Label>
            {renderStatistics()}
          </>
        ) : (
          <>
            <InfoTable>
              <InfoRow>
                <InfoLabel>Name:</InfoLabel>
                <div>{recipient.name}</div>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Email:</InfoLabel>
                <div>{recipient.email}</div>
              </InfoRow>
              <div>
                <Label $marginTop="22px">Groups ({groups.length})</Label>
                <div>
                  {groups.map((group) => (
                    <RecipientPill
                      key={group.id}
                      recipient={group}
                      clickHandler={() => {}}
                    />
                  ))}
                </div>
              </div>
            </InfoTable>
            <Label $marginTop="22px">Statistics</Label>
            {renderStatistics()}
          </>
        )}
        <Footer>
          <RemoveButton
            onClick={() => {
              removeHandler(recipient);
            }}
          >
            Remove Recipient
          </RemoveButton>
          <CloseButton onClick={closeHandler}>Close</CloseButton>
        </Footer>
      </StyledContent>
    </Root>
  );
};

export default RecipientDetailDialog;
