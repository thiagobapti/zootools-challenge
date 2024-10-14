import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import RecipientPill from "./RecipientPill";
import * as Popover from "@radix-ui/react-popover";
import { Contact, ContactGroup, SelectableRecipient } from "../types/general";
import RecipientDetailDialog from "./RecipientDetailDialog";
import { contactGroups, contacts } from "../data/database";

const Root = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
`;

const Label = styled.span`
  font-weight: 600;
  margin-right: 8px;
  font-size: 14px;
  margin-top: 6px;
`;

const PopoverContent = styled(Popover.Content)`
  background: #fff;
  border-radius: 8px;
  padding: 12px 6px;
  min-width: 260px;
  box-shadow: 0px 0px 8px 4px #00000024;
  outline: none;
`;

const PopoverLabel = styled.div`
  font-weight: 600;
  font-size: 12px;
`;

const TextInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  flex: 1;
  width: 100%;
  min-width: 200px;
  margin-top: 10px;
`;

const PopoverEmpty = styled.div`
  font-style: italic;
  color: #999;
  margin-top: 8px;
  font-size: 12px;
`;

const InputWrapper = styled.div`
  position: relative;
  flex: 1;
`;

interface RecipientsInputProps {
  recipients: (Contact | ContactGroup)[];
  updateRecipients: (newRecipients: (Contact | ContactGroup)[]) => void;
}

const RecipientsInput: React.FC<RecipientsInputProps> = ({
  recipients,
  updateRecipients,
}) => {
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [campaignRecipients, setCampaignRecipients] = useState<
    (Contact | ContactGroup)[]
  >([]);
  const [recipientsPopoverOpen, setRecipientsPopoverOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectableContacts, setSelectableContacts] = useState<
    SelectableRecipient[]
  >([]);
  const [selectableContactGroups, setSelectableContactGroups] = useState<
    SelectableRecipient[]
  >([]);
  const [selectedRecipient, setSelectedRecipient] = useState<
    Contact | ContactGroup | undefined
  >(undefined);

  useEffect(() => {
    setCampaignRecipients(recipients);
  }, [recipients]);

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

  useEffect(() => {
    const existingContactIds = new Set(
      campaignRecipients
        .filter((r): r is Contact => (r as Contact).name !== undefined)
        .map((r) => r.id)
    );
    const existingGroupIds = new Set(
      campaignRecipients
        .filter(
          (r): r is ContactGroup => (r as ContactGroup).label !== undefined
        )
        .map((r) => r.id)
    );

    const filteredContactGroups = contactGroups.filter(
      (contactGroup) =>
        !existingGroupIds.has(contactGroup.id) &&
        contactGroup.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredContacts = contacts.filter(
      (contact) =>
        !existingContactIds.has(contact.id) &&
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
  }, [searchTerm, campaignRecipients]);

  const handleRecipientClick = useCallback(
    (recipient: Contact | ContactGroup) => {
      updateRecipients([...campaignRecipients, recipient]);
    },
    [campaignRecipients, updateRecipients]
  );

  const handleBackspace = useCallback(() => {
    setCampaignRecipients((prevCampaignRecipients) => {
      const updatedRecipients = prevCampaignRecipients.slice(0, -1);
      return updatedRecipients;
    });
  }, []);

  //TODO
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Backspace") {
        handleBackspace();
      } else if (
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
    [
      selectableContactGroups,
      selectableContacts,
      handleRecipientClick,
      handleBackspace,
    ]
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      handleKeyDown(e);
    },
    [handleKeyDown]
  );

  const handlePopoverKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      handleKeyDown(e);
    },
    [handleKeyDown]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setRecipientsPopoverOpen(true);
    },
    []
  );

  const handleInputBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (
        (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) &&
        (!popoverRef.current || !popoverRef.current.contains(e.relatedTarget))
      ) {
        setRecipientsPopoverOpen(false);
      }
    },
    []
  );

  const handlePopoverBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setRecipientsPopoverOpen(false);
      }
    },
    []
  );

  const handlePopoverEscape = useCallback(() => {
    setRecipientsPopoverOpen(false);
  }, []);

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

  const handleRootClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setRecipientsPopoverOpen(true);
  }, []);

  const handleSelection = useCallback((recipient: Contact | ContactGroup) => {
    setSelectedRecipient(recipient);
  }, []);

  const handleRecipientRemove = useCallback(
    (recipient: Contact | ContactGroup) => {
      setCampaignRecipients((prevCampaignRecipients) => {
        const updatedRecipients = prevCampaignRecipients.filter(
          (r) => r !== recipient
        );
        return updatedRecipients;
      });
      setSelectedRecipient(undefined);
    },
    [setCampaignRecipients]
  );

  return (
    <Root onClick={handleRootClick}>
      <Label>To:</Label>
      {campaignRecipients.map((recipient) => (
        <RecipientPill
          recipient={recipient}
          key={`${(recipient as Contact).name ? "contact" : "contact-group"}-${
            (recipient as Contact).id
          }`}
          clickHandler={handleSelection}
          title="Click to see details"
        />
      ))}
      <Popover.Root open={recipientsPopoverOpen}>
        <InputWrapper>
          <TextInput
            type="text"
            ref={inputRef}
            onChange={handleSearchChange}
            onFocus={handleInputFocus}
            onKeyDown={handleInputKeyDown}
            onClick={handleInputFocus}
            onBlur={handleInputBlur}
          />
          <Popover.Anchor />
        </InputWrapper>
        <Popover.Portal>
          <PopoverContent
            ref={popoverRef}
            onOpenAutoFocus={(e) => e.preventDefault()}
            onBlur={handlePopoverBlur}
            onEscapeKeyDown={handlePopoverEscape}
            sideOffset={10}
            side="bottom"
            align="start"
            tabIndex={-1}
            onKeyDown={handlePopoverKeyDown}
          >
            <PopoverLabel>Tags ({selectableContactGroups.length})</PopoverLabel>
            {!selectableContactGroups.length && (
              <PopoverEmpty>None</PopoverEmpty>
            )}
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
                  tabIndex={-1}
                />
              )
            )}
            <br />
            <PopoverLabel>
              Individuals ({selectableContacts.length})
            </PopoverLabel>
            {!selectableContacts.length && <PopoverEmpty>None</PopoverEmpty>}
            {selectableContacts.map((contact: SelectableRecipient) => (
              <RecipientPill
                recipient={contact.recipient as Contact}
                selected={contact.selected}
                key={`contact-${(contact.recipient as Contact).id}`}
                clickHandler={handleRecipientClick}
                title="Click to add to recipients"
                tabIndex={-1}
              />
            ))}
          </PopoverContent>
        </Popover.Portal>
      </Popover.Root>
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

export default RecipientsInput;
