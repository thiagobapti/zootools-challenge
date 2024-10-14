import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import RecipientPill from "./RecipientPill";
import * as Popover from "@radix-ui/react-popover";
import { contactGroups, contacts, editorVariables } from "../data/database";
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
import {
  DefaultReactSuggestionItem,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import {
  BlockNoteSchema,
  defaultInlineContentSpecs,
  filterSuggestionItems,
} from "@blocknote/core";
import { EditorVariable } from "./EditorVariable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

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
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
`;

const Subject = styled.div`
  margin-top: 8px;
`;

const Editor = styled.div`
  margin-top: 8px;
  flex: 1;
`;

const RecipientLabel = styled.span`
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

const RecipientPopoverLabel = styled.div`
  font-weight: 600;
  font-size: 12px;
`;

const RecipientTextInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  flex: 1;
  width: 100%;
  min-width: 200px;
  margin-top: 10px;
`;

const RecipientPopoverEmpty = styled.div`
  font-style: italic;
  color: #999;
  margin-top: 8px;
  font-size: 12px;
`;

const RecipientsInputWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const EmailEditor: React.FC<{
  currentCampaign: Campaign;
  onCampaignUpdate: (updatedCampaign: Campaign) => void;
}> = ({ currentCampaign, onCampaignUpdate }) => {
  const [campaign, setCampaign] = useState<Campaign>({
    ...currentCampaign,
    subject: currentCampaign.subject || "",
  });

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
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const schema = BlockNoteSchema.create({
    inlineContentSpecs: {
      ...defaultInlineContentSpecs,
      mention: EditorVariable,
    },
  });

  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "paragraph",
        content: "Hello, world!",
      },
    ],
  });

  useEffect(() => {
    setCampaign({
      ...currentCampaign,
      subject: currentCampaign.subject || "",
    });
  }, [currentCampaign]);

  useEffect(() => {
    const existingContactIds = new Set(
      campaign?.recipients
        .filter((r): r is Contact => (r as Contact).name !== undefined)
        .map((r) => r.id)
    );
    const existingGroupIds = new Set(
      campaign?.recipients
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

  const handleRecipientsSearch = useCallback(
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

  const handleBackspace = useCallback(() => {
    setCampaign((prevCampaign) => {
      if (!prevCampaign || prevCampaign.recipients.length === 0)
        return prevCampaign;
      const updatedRecipients = prevCampaign.recipients.slice(0, -1);
      return { ...prevCampaign, recipients: updatedRecipients };
    });
  }, []);

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

  const getVariablesMenuItems = (
    editor: typeof schema.BlockNoteEditor
  ): DefaultReactSuggestionItem[] => {
    return editorVariables.map((variable) => ({
      title: variable.label,
      group: variable.group,
      icon: <FontAwesomeIcon icon={faUser} />,
      subtext: variable.subtext,
      onItemClick: () => {
        editor.insertInlineContent([
          {
            type: "mention",
            props: {
              variableId: variable.id,
              variableLabel: variable.label,
            },
          },
          " ",
        ]);
      },
    }));
  };

  const handleEditorChange = useCallback(async () => {
    // setBodyJSON(content);
    console.log(editor.document);
    const fullHTML = await editor.blocksToFullHTML(editor.document);
    console.log(fullHTML);
    const lossyHTML = await editor.blocksToHTMLLossy(editor.document);
    console.log(lossyHTML);
  }, [editor]);

  const handlePreview = useCallback(() => {
    // const html = mjmlToHTML(editor.document.toString());
    //     const html = mjmlToHTML(`<mjml>
    //   <mj-body>
    //     <mj-section>
    //       <mj-column>
    //         <mj-image width="100px" src="/assets/img/logo-small.png"></mj-image>
    //         <mj-divider border-color="#F45E43"></mj-divider>
    //         <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hello World</mj-text>
    //       </mj-column>
    //     </mj-section>
    //   </mj-body>
    // </mjml>`);
    //     console.log(html);
  }, [editor]);

  const handleRecipientsClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setRecipientsPopoverOpen(true);
  }, []);

  return (
    <Root>
      <Header>
        New Message
        <button onClick={handlePreview}>Preview</button>
      </Header>
      <Message>
        <Recipients onClick={handleRecipientsClick}>
          <RecipientLabel>To:</RecipientLabel>
          {campaign?.recipients.map((recipient) => (
            <RecipientPill
              recipient={recipient}
              key={`${
                (recipient as Contact).name ? "contact" : "contact-group"
              }-${(recipient as Contact).id}`}
              clickHandler={handleRecipientSelection}
              title="Click to see details"
            />
          ))}

          <Popover.Root open={recipientsPopoverOpen}>
            <RecipientsInputWrapper>
              <RecipientTextInput
                type="text"
                ref={inputRef}
                onChange={handleRecipientsSearch}
                onFocus={handleInputFocus}
                onKeyDown={handleInputKeyDown}
                onClick={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <Popover.Anchor />
            </RecipientsInputWrapper>
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
                <RecipientPopoverLabel>
                  Tags ({selectableContactGroups.length})
                </RecipientPopoverLabel>
                {!selectableContactGroups.length && (
                  <RecipientPopoverEmpty>None</RecipientPopoverEmpty>
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
                {!selectableContacts.length && (
                  <RecipientPopoverEmpty>None</RecipientPopoverEmpty>
                )}
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
          <BlockNoteView
            editor={editor}
            theme="light"
            onChange={handleEditorChange}
          >
            <SuggestionMenuController
              triggerCharacter={"@"}
              getItems={async (query) =>
                filterSuggestionItems(getVariablesMenuItems(editor), query)
              }
            />
          </BlockNoteView>
        </Editor>
        {/* <EmailPreview /> */}
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
