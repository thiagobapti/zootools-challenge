type Campaign = {
  id: string;
  subject: string;
  status: "draft" | "scheduled" | "sent";
  createdAt: string;
  body: string;
  recipients: (Contact | ContactGroup)[];
};

type Contact = {
  id: string;
  name: string;
  email: string;
};

type ContactGroup = {
  id: string;
  label: string;
  themeColor: string;
};

type ThemeColor = {
  grey: string;
  orange: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
};

type SelectableRecipient = {
  selected: boolean;
  recipient: Contact | ContactGroup;
};

export type {
  Campaign,
  Contact,
  ContactGroup,
  SelectableRecipient,
  ThemeColor,
};
