import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { editorVariables } from "../data/database";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { Campaign, Contact, ContactGroup } from "../types/general";
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
import RecipientsInput from "./RecipientsInput";
import RecipientDetailDialog from "./RecipientDetailDialog";

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

const Subject = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: row;
`;

const SubjectInput = styled.input`
  border: none;
  outline: none;
  flex: 1;
`;

const Label = styled.span`
  font-weight: 600;
  margin-right: 8px;
  font-size: 14px;
`;

const Editor = styled.div`
  margin-top: 20px;
  flex: 1;
`;

interface EmailEditorProps {
  currentCampaign: Campaign;
  onCampaignUpdate: (updatedCampaign: Campaign) => void;
}

const EmailEditor: React.FC<EmailEditorProps> = ({
  currentCampaign,
  onCampaignUpdate,
}) => {
  const [campaign, setCampaign] = useState<Campaign>();
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
        content: "",
      },
    ],
  });
  const [selectedRecipient, setSelectedRecipient] = useState<
    Contact | ContactGroup | undefined
  >(undefined);

  useEffect(() => {
    setCampaign(currentCampaign);
  }, [currentCampaign]);

  useEffect(() => {
    if (campaign) {
      onCampaignUpdate(campaign);
    }
  }, [campaign, onCampaignUpdate]);

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

  const updateRecipients = useCallback(
    (newRecipients: (Contact | ContactGroup)[]) => {
      setCampaign((prevCampaign) => {
        if (!prevCampaign) return prevCampaign;
        return { ...prevCampaign, recipients: newRecipients };
      });
    },
    []
  );

  const handleRecipientDetailClose = useCallback(() => {
    setSelectedRecipient(undefined);
  }, []);

  const handleRecipientRemove = useCallback(
    (recipient: Contact | ContactGroup) => {
      setCampaign((prevCampaign) => {
        if (!prevCampaign) return prevCampaign;
        const updatedRecipients = prevCampaign.recipients.filter(
          (r) => r !== recipient
        );
        return { ...prevCampaign, recipients: updatedRecipients };
      });
      setSelectedRecipient(undefined);
    },
    []
  );

  const handleRecipientSelection = useCallback(
    (recipient: Contact | ContactGroup) => {
      setSelectedRecipient(recipient);
    },
    []
  );

  return (
    <Root>
      <Header>New Message</Header>
      <Message>
        <RecipientsInput
          recipients={campaign?.recipients || []}
          updateRecipients={updateRecipients}
          recipientSelectionHandler={handleRecipientSelection}
        />
        <Subject>
          <Label>Subject:</Label>
          <SubjectInput
            type="text"
            value={campaign?.subject || ""}
            onChange={handleSubjectChange}
          />
        </Subject>
        <Editor>
          <BlockNoteView editor={editor} theme="light">
            <SuggestionMenuController
              triggerCharacter={"@"}
              getItems={async (query) =>
                filterSuggestionItems(getVariablesMenuItems(editor), query)
              }
            />
          </BlockNoteView>
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
