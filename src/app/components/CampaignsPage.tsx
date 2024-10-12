import React from "react";
import styled from "styled-components";
import MainHeader from "./MainHeader";
import * as Tabs from "@radix-ui/react-tabs";

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

const Content = styled.div`
  width: 100%;
  flex: 1;
  background-color: #fff;
  height: 100%;
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
  // margin-left: 20px;
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

type Campaign = {
  id: string;
  subject: string;
  status: "draft" | "scheduled" | "sent";
  createdAt: string;
  body: string;
};

const CampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
  const [campaign, setCampaign] = React.useState<Campaign | null>(null);

  const handleNewCampaign = () => {
    setCampaign({
      id: "1",
      subject: "",
      status: "draft",
      createdAt: new Date().toISOString(),
      body: "",
    });
  };

  return (
    <Root>
      <SideList>
        <SideListHeader>
          Marketing Emails
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
        </CampaignList>
      </SideList>
      <Container>
        {/* <MainHeader /> */}

        <Tabs.Root defaultValue="write">
          <StyledMainHeader>
            {campaign && (
              <TabsList>
                <TabTrigger value="write">1. Write</TabTrigger>
                <TabTrigger value="send" disabled>
                  2. Send
                </TabTrigger>
                <TabTrigger value="analyze" disabled>
                  3. Analyze
                </TabTrigger>
              </TabsList>
            )}
          </StyledMainHeader>

          <Tabs.Content value="write">
            <Content>{campaign && ""}</Content>
          </Tabs.Content>
          <Tabs.Content value="send">Send</Tabs.Content>
          <Tabs.Content value="analyze">Analyze</Tabs.Content>
        </Tabs.Root>
      </Container>
    </Root>
  );
};

export default CampaignsPage;
