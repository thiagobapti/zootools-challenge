import React, { useCallback } from "react";
import styled from "styled-components";
import * as Tabs from "@radix-ui/react-tabs";
import EmailEditor from "./EmailEditor";
import {
  Campaign,
  Contact,
  ContactGroup,
  SelectableRecipient,
  StatusColor,
} from "../types/general";
import { formatDate } from "../util/formatters";
import { statusColors } from "../data/database";

const Root = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const SideList = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 1px solid #d7d7d7;
  background-color: #fff;
  width: 320px;
`;

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const EditorWrapper = styled.div`
  width: 100%;
  flex: 1;
  background-color: #fff;
  height: 100%;
  padding: 40px;
  display: flex;
  flex-direction: column;
`;

const SideListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  background-color: #fff;
  border-bottom: 1px solid #d7d7d7;
  padding: 0 18px;
  font-size: 18px;
  font-weight: 600;
`;

const HeaderButton = styled.button`
  background: #0f82ea;
  border-radius: 6px;
  color: #fff;
  padding: 8px 16px;
  border: none;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
`;

const NoCampaigns = styled.div`
  padding: 16px 22px;
  background-color: #fff9d0;
  border-radius: 6px;
  font-size: 16px;
  line-height: 1.4;
  text-align: center;
  cursor: pointer;
`;

const CampaignList = styled.div`
  padding: 16px;
`;

const StyledMainHeader = styled.div`
  height: 70px;
  background-color: #fff;
  border-bottom: 1px solid #d7d7d7;
  padding: 0 18px;
`;

const TabsList = styled(Tabs.List)`
  height: 100%;
`;

const TabTrigger = styled(Tabs.Trigger)`
  height: calc(100% - 1px);
  background-color: transparent;
  border: none;
  font-size: 16px;
  font-weight: 600;
  color: #b0b0b0;
  position: relative;

  &[data-state="active"] {
    color: #000;
    border-bottom: 2px solid #000;
  }

  &:not(:first-child) {
    margin-left: 40px;
  }

  &:not(:first-child)::after {
    content: "";
    position: absolute;
    left: -24px;
    top: 50%;
    transform: translateY(-50%);
    width: 10px;
    height: 10px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'%3E%3Cpath fill='%23b0b0b0' d='M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
`;

const EditorTabContent = styled(Tabs.Content)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TabsRoot = styled(Tabs.Root)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CampaignItem = styled.div`
  padding: 16px;
  border-radius: 6px;
  background-color: #f1f1f1;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.3;

  & + & {
    margin-top: 6px;
  }
`;

const CampaignStatusBadge = styled.div<{ $status: keyof StatusColor }>`
  background-color: ${({ $status }) => statusColors[$status]};
  color: #fff;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #000;
`;

const CampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
  const [currentCampaign, setCurrentCampaign] = React.useState<Campaign | null>(
    null
  );

  const handleNewCampaign = () => {
    const newCampaign: Campaign = {
      id: (campaigns.length + 1).toString(),
      subject: "",
      status: "draft",
      createdAt: new Date().toISOString(),
      body: "",
      recipients: [],
    };
    setCurrentCampaign(newCampaign);
    setCampaigns((prevCampaigns) => [...prevCampaigns, newCampaign]);
  };

  const handleCampaignUpdate = useCallback(
    (updatedCampaign: Campaign) => {
      setCampaigns((prevCampaigns) => {
        return prevCampaigns.map((campaign) =>
          campaign.id === updatedCampaign.id ? updatedCampaign : campaign
        );
      });
    },
    [setCampaigns]
  );

  const getUniqueRecipientCount = (recipients: (Contact | ContactGroup)[]) => {
    const uniqueRecipients = new Set<string>();
    recipients.forEach((recipient) => {
      if ("email" in recipient) {
        uniqueRecipients.add(recipient.email);
      } else if ("contacts" in recipient) {
        recipient.contacts.forEach((contact) => {
          uniqueRecipients.add(contact.email);
        });
      }
    });
    return uniqueRecipients.size;
  };

  return (
    <Root>
      <SideList>
        <SideListHeader>
          Marketing Emails ({campaigns.length})
          <HeaderButton onClick={handleNewCampaign} title="Create new campaign">
            New
          </HeaderButton>
        </SideListHeader>
        <CampaignList>
          {!campaigns.length && (
            <NoCampaigns
              onClick={handleNewCampaign}
              title="Create new campaign"
            >
              It’s a little lonely here.
              <br />
              Start your first campaign and let’s change that! 🚀
            </NoCampaigns>
          )}
          {campaigns.map((campaign) => (
            <CampaignItem key={campaign.id}>
              <CampaignStatusBadge $status={campaign.status}>
                {campaign.status}
              </CampaignStatusBadge>
              <strong>{campaign.subject || "Untitled"}</strong>
              <div>{campaign.body || "No body"}</div>
              <div>Created At: {formatDate(campaign.createdAt)}</div>
              <div>
                {getUniqueRecipientCount(campaign.recipients)} Recipients
              </div>
            </CampaignItem>
          ))}
        </CampaignList>
      </SideList>
      <Container>
        {currentCampaign && (
          <TabsRoot defaultValue="write">
            <StyledMainHeader>
              <TabsList>
                <TabTrigger value="write">1. Write</TabTrigger>
                <TabTrigger value="send" disabled>
                  2. Send
                </TabTrigger>
                <TabTrigger value="analyze" disabled>
                  3. Analyze
                </TabTrigger>
              </TabsList>
            </StyledMainHeader>

            <EditorTabContent value="write">
              <EditorWrapper>
                <EmailEditor
                  currentCampaign={currentCampaign}
                  onCampaignUpdate={handleCampaignUpdate}
                />
              </EditorWrapper>
            </EditorTabContent>
            <Tabs.Content value="send">Send</Tabs.Content>
            <Tabs.Content value="analyze">Analyze</Tabs.Content>
          </TabsRoot>
        )}
      </Container>
    </Root>
  );
};

export default CampaignsPage;
