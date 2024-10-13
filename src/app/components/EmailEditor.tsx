import * as Tabs from "@radix-ui/react-tabs";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import RecipientPill from "./RecipientPill";
import * as Popover from "@radix-ui/react-popover";
import { groups, contacts } from "../data/database";
import { ContactGroup, Contact, Campaign } from "../types/general";

const Root = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Message = styled.div`
  box-shadow: 0px 0px 14.5px 6px #00000014;
  border-radius: 12px;
  margin-top: 24px;
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
`;

const Recipients = styled.div`
  border: 1px solid #d7d7d7;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: flex-end;
`;

const Subject = styled.div`
  margin-top: 8px;
  border: 1px solid #d7d7d7;
`;

const Editor = styled.div`
  margin-top: 8px;
  border: 1px solid #d7d7d7;
  flex: 1;
`;

const RecipientLabel = styled.span`
  font-weight: 600;
  margin-right: 4px;
  font-size: 14px;
`;

const EmailEditor: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
  const [recipientsPopoverOpen, setRecipientsPopoverOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const handleRecipientsSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRecipientsPopoverOpen(e.target.value.length > 0);
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleInputBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      // Check if the related target (the element that receives focus) is within the popover
      if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
        setRecipientsPopoverOpen(false);
      }
    },
    []
  );

  return (
    <Root>
      <Header>New Message</Header>
      <Message>
        <Recipients>
          <RecipientLabel>To:</RecipientLabel>
          {/* {recipientsData.map((recipient) => (
            <RecipientPill recipient={recipient} key={recipient.id} />
          ))} */}
          <input type="text" onChange={handleRecipientsSearch} />
          <Popover.Root open={recipientsPopoverOpen}>
            <Popover.Anchor />
            <Popover.Portal>
              <Popover.Content
                onBlur={handleInputBlur}
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                All contacts (10)
                <br />
                Tags (3)
                <br />
                {/* {recipientsData
                  .filter((recipient) =>
                    recipient.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((recipient) => (
                    <RecipientPill recipient={recipient} key={recipient.id} />
                  ))} */}
                Individuals:
                {/* {recipientsData
                  .filter((recipient) =>
                    recipient.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((recipient) => (
                    <RecipientPill recipient={recipient} key={recipient.id} />
                  ))} */}
                {/* <Popover.Close /> */}
                {/* <Popover.Arrow /> */}
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </Recipients>
        <Subject>Subject</Subject>
        <Editor>Editor</Editor>
      </Message>
    </Root>
  );
};

export default EmailEditor;
