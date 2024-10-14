import * as Tabs from "@radix-ui/react-tabs";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import RecipientPill from "./RecipientPill";
import * as Popover from "@radix-ui/react-popover";
import { contactGroups, contacts } from "../data/database";
import * as Separator from "@radix-ui/react-separator";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import {
  ContactGroup,
  Contact,
  Campaign,
  SelectableRecipient,
} from "../types/general";
import RecipientDetailDialog from "./RecipientDetailDialog";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

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
  // border: 1px solid #d7d7d7;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: flex-end;
`;

const Subject = styled.div`
  margin-top: 8px;
  // border: 1px solid #d7d7d7;
`;

const Editor = styled.div`
  margin-top: 8px;
  // border: 1px solid #d7d7d7;
  flex: 1;
`;

const RecipientLabel = styled.span`
  font-weight: 600;
  margin-right: 4px;
  font-size: 14px;
`;

const PopoverContent = styled(Popover.Content)`
  background: #f1f1f1;
  border: 1px solid #d7d7d7;
  border-radius: 8px;
  padding: 12px 6px;
`;

const RecipientPopoverLabel = styled.div`
  font-weight: 600;
  font-size: 12px;
`;

const RecipientTextInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  flex: 1;
`;

const EmailEditor: React.FC<{
  currentCampaign: Campaign;
  onCampaignUpdate: (updatedCampaign: Campaign) => void;
}> = ({ currentCampaign, onCampaignUpdate }) => {
  const editor = useCreateBlockNote();
  const [campaign, setCampaign] = useState<Campaign>({
    ...currentCampaign,
    subject: currentCampaign.subject || "", // Default to an empty string
  });
  const [recipientsPopoverOpen, setRecipientsPopoverOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectableContacts, setSelectableContacts] = useState<
    SelectableRecipient[]
  >([]);
  const [selectableContactGroups, setSelectableContactGroups] = useState<
    SelectableRecipient[]
  >([]);
  // const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedRecipient, setSelectedRecipient] = useState<
    Contact | ContactGroup | undefined
  >(undefined);

  useEffect(() => {
    setCampaign({
      ...currentCampaign,
      subject: currentCampaign.subject || "", // Ensure subject is always defined
    });
  }, [currentCampaign]);

  useEffect(() => {
    const existingRecipientIds = new Set(campaign?.recipients.map((r) => r.id));

    const filteredContactGroups = contactGroups.filter(
      (contactGroup) =>
        !existingRecipientIds.has(contactGroup.id) &&
        contactGroup.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredContacts = contacts.filter(
      (contact) =>
        !existingRecipientIds.has(contact.id) &&
        contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSelectableContactGroups(
      filteredContactGroups.map((group, index) => ({
        selected: index === 0,
        recipient: group,
      }))
    );

    if (filteredContactGroups.length === 0) {
      setSelectableContacts(
        filteredContacts.map((contact, index) => ({
          selected: index === 0,
          recipient: contact,
        }))
      );
    } else {
      setSelectableContacts(
        filteredContacts.map((contact) => ({
          selected: false,
          recipient: contact,
        }))
      );
    }
  }, [searchTerm, campaign]);

  useEffect(() => {
    setSelectableContacts(
      contacts.map((contact) => ({ selected: false, recipient: contact }))
    );
    setSelectableContactGroups(
      contactGroups.map((contactGroup) => ({
        selected: false,
        recipient: contactGroup,
      }))
    );
  }, []);
  // const editor = useCreateBlockNote();

  const handleRecipientsSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setRecipientsPopoverOpen(true);
    },
    []
  );

  const handleInputBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
        setRecipientsPopoverOpen(false);
      }
    },
    []
  );

  const handleInputFocus = useCallback(() => {
    setSelectableContactGroups((prevGroups) =>
      prevGroups.map((group, index) => ({
        ...group,
        selected: index === 0,
      }))
    );
    setSelectableContacts((prevContacts) =>
      prevContacts.map((contact) => ({
        ...contact,
        selected: false,
      }))
    );
    setRecipientsPopoverOpen(true);
  }, []);

  const handleRecipientDetailClose = useCallback(() => {
    setSelectedRecipient(undefined);
  }, []);

  const handleRecipientClick = useCallback(
    (recipient: Contact | ContactGroup) => {
      setCampaign((prevCampaign) => {
        if (!prevCampaign) return prevCampaign;
        const updatedCampaign = {
          ...prevCampaign,
          recipients: [...prevCampaign.recipients, recipient],
        };
        return updatedCampaign;
      });
    },
    []
  );
  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === "Tab" ||
        (e.key === "Tab" && e.shiftKey)
      ) {
        e.preventDefault();
        const isArrowDown =
          e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey);
        const currentGroupIndex = selectableContactGroups.findIndex(
          (r) => r.selected
        );
        const currentContactIndex = selectableContacts.findIndex(
          (r) => r.selected
        );

        if (currentGroupIndex !== -1) {
          setSelectableContactGroups((prevGroups) => {
            const updatedGroups = [...prevGroups];
            updatedGroups[currentGroupIndex].selected = false;
            const nextIndex = isArrowDown
              ? currentGroupIndex + 1
              : currentGroupIndex - 1;
            if (nextIndex >= 0 && nextIndex < prevGroups.length) {
              updatedGroups[nextIndex].selected = true;
            } else if (isArrowDown) {
              setSelectableContacts((prevContacts) => {
                const updatedContacts = [...prevContacts];
                updatedContacts[0].selected = true;
                return updatedContacts;
              });
            } else {
              setSelectableContacts((prevContacts) => {
                const updatedContacts = [...prevContacts];
                updatedContacts[prevContacts.length - 1].selected = true;
                return updatedContacts;
              });
            }
            return updatedGroups;
          });
        } else if (currentContactIndex !== -1) {
          setSelectableContacts((prevContacts) => {
            const updatedContacts = [...prevContacts];
            updatedContacts[currentContactIndex].selected = false;
            const nextIndex = isArrowDown
              ? currentContactIndex + 1
              : currentContactIndex - 1;
            if (nextIndex >= 0 && nextIndex < prevContacts.length) {
              updatedContacts[nextIndex].selected = true;
            } else if (isArrowDown) {
              setSelectableContactGroups((prevGroups) => {
                const updatedGroups = [...prevGroups];
                updatedGroups[0].selected = true;
                return updatedGroups;
              });
            } else {
              setSelectableContactGroups((prevGroups) => {
                const updatedGroups = [...prevGroups];
                updatedGroups[prevGroups.length - 1].selected = true;
                return updatedGroups;
              });
            }
            return updatedContacts;
          });
        }
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const selectedGroupIndex = selectableContactGroups.findIndex(
          (r) => r.selected
        );
        const selectedContactIndex = selectableContacts.findIndex(
          (r) => r.selected
        );

        if (selectedGroupIndex !== -1) {
          handleRecipientClick(
            selectableContactGroups[selectedGroupIndex].recipient
          );
          setSelectableContactGroups((prevGroups) => {
            const updatedGroups = [...prevGroups];
            updatedGroups[selectedGroupIndex].selected = false;
            const nextIndex = selectedGroupIndex + 1;
            if (nextIndex < prevGroups.length) {
              updatedGroups[nextIndex].selected = true;
            } else if (selectableContacts.length > 0) {
              setSelectableContacts((prevContacts) => {
                const updatedContacts = [...prevContacts];
                updatedContacts[0].selected = true;
                return updatedContacts;
              });
            }
            return updatedGroups;
          });
        } else if (selectedContactIndex !== -1) {
          handleRecipientClick(
            selectableContacts[selectedContactIndex].recipient
          );
          setSelectableContacts((prevContacts) => {
            const updatedContacts = [...prevContacts];
            updatedContacts[selectedContactIndex].selected = false;
            const nextIndex = selectedContactIndex + 1;
            if (nextIndex < prevContacts.length) {
              updatedContacts[nextIndex].selected = true;
            }
            return updatedContacts;
          });
        }
      } else if (e.key === "Escape") {
        setRecipientsPopoverOpen(false);
      }
    },
    [selectableContactGroups, selectableContacts, handleRecipientClick]
  );

  useEffect(() => {
    if (campaign) {
      onCampaignUpdate(campaign);
    }
  }, [campaign, onCampaignUpdate]);

  const handleRecipientSelection = useCallback(
    (recipient: Contact | ContactGroup) => {
      setSelectedRecipient(recipient);
    },
    []
  );

  const handleRecipientRemove = useCallback(
    (recipient: Contact | ContactGroup) => {
      setCampaign((prevCampaign) => {
        if (!prevCampaign) return prevCampaign;
        const updatedCampaign = {
          ...prevCampaign,
          recipients: prevCampaign.recipients.filter((r) => r !== recipient),
        };
        setSelectedRecipient(undefined);
        return updatedCampaign;
      });
    },
    []
  );

  const handleSubjectChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCampaign((prevCampaign) => {
        if (!prevCampaign) return prevCampaign;
        return { ...prevCampaign, subject: e.target.value };
      });
    },
    []
  );

  return (
    <Root>
      <Header>New Message</Header>
      <Message>
        <Recipients>
          <RecipientLabel>To:</RecipientLabel>
          {campaign?.recipients.map((recipient) => (
            <RecipientPill
              recipient={recipient}
              key={recipient.id}
              clickHandler={handleRecipientSelection}
              title="Click to see details"
            />
          ))}

          <Popover.Root open={recipientsPopoverOpen}>
            <div style={{ position: "relative" }}>
              <RecipientTextInput
                type="text"
                onChange={handleRecipientsSearch}
                onFocus={handleInputFocus}
                onKeyDown={handleInputKeyDown}
                onClick={handleInputFocus}
              />
              <Popover.Anchor />
            </div>
            <Popover.Portal>
              <PopoverContent
                onBlur={handleInputBlur}
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <RecipientPopoverLabel>
                  Tags ({selectableContactGroups.length})
                </RecipientPopoverLabel>
                {selectableContactGroups.map(
                  (contactGroup: SelectableRecipient) => (
                    <RecipientPill
                      recipient={contactGroup.recipient as ContactGroup}
                      selected={contactGroup.selected}
                      key={`contact-group-${
                        (contactGroup.recipient as ContactGroup).id
                      }`}
                      clickHandler={handleRecipientClick}
                      title="Click to add to recipients"
                    />
                  )
                )}
                <Separator.Root
                  className="SeparatorRoot"
                  decorative
                  orientation="horizontal"
                  style={{ margin: "0 15px" }}
                />
                <br />
                <RecipientPopoverLabel>
                  Individuals ({selectableContacts.length})
                </RecipientPopoverLabel>
                {selectableContacts.map((contact: SelectableRecipient) => (
                  <RecipientPill
                    recipient={contact.recipient as Contact}
                    selected={contact.selected}
                    key={`contact-${(contact.recipient as Contact).id}`}
                    clickHandler={handleRecipientClick}
                    title="Click to add to recipients"
                  />
                ))}
                {/* <Popover.Close /> */}
                {/* <Popover.Arrow /> */}
              </PopoverContent>
            </Popover.Portal>
          </Popover.Root>
        </Recipients>
        <Subject>
          Subject:
          <input
            type="text"
            value={campaign?.subject}
            onChange={handleSubjectChange}
          />
        </Subject>
        <Editor>
          <BlockNoteView editor={editor} theme="light" />
        </Editor>
      </Message>
      {selectedRecipient && (
        <RecipientDetailDialog
          recipient={selectedRecipient}
          closeHandler={handleRecipientDetailClose}
          removeHandler={handleRecipientRemove}
        />
      )}
    </Root>
  );
};

export default EmailEditor;
