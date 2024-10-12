import * as Tabs from "@radix-ui/react-tabs";
import React from "react";
import styled from "styled-components";
import RecipientPill from "./RecipientPill";

const recipientsData = [
  { id: "1", type: "individual", name: "Thiago", email: "thiago@example.com" },
  { id: "2", type: "individual", name: "Jorge", email: "jorge@example.com" },
  { id: "3", type: "individual", name: "Thiago", email: "thiago@example.com" },
  { id: "4", type: "individual", name: "Jorge", email: "jorge@example.com" },
  { id: "5", type: "individual", name: "Thiago", email: "thiago@example.com" },
  { id: "6", type: "individual", name: "Jorge", email: "jorge@example.com" },
  { id: "7", type: "individual", name: "Thiago", email: "thiago@example.com" },
  { id: "8", type: "individual", name: "Jorge", email: "jorge@example.com" },
  { id: "9", type: "individual", name: "Thiago", email: "thiago@example.com" },
  { id: "10", type: "individual", name: "Jorge", email: "jorge@example.com" },
  { id: "11", type: "tag", name: "US customers", themeColor: "249, 115, 22" },
  {
    id: "12",
    type: "tag",
    name: "Europe customers",
    themeColor: "225, 29, 72",
  },
  { id: "13", type: "tag", name: "Asia customers", themeColor: "132, 204, 22" },
];

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

const EmailEditor: React.FC = () => {
  return (
    <Root>
      <Header>New Message</Header>
      <Message>
        <Recipients>
          {recipientsData.map((recipient) => (
            <RecipientPill recipient={recipient} key={recipient.id} />
          ))}
        </Recipients>
        <Subject>Subject</Subject>
        <Editor>Editor</Editor>
      </Message>
    </Root>
  );
};

export default EmailEditor;
