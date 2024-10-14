// Define a base type for common properties
type BaseContact = {
  id: string;
  campaignsSent: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
};

type Contact = BaseContact & {
  name: string;
  email: string;
};

type ContactGroup = BaseContact & {
  label: string;
  themeColor: string;
  contacts: Contact[];
};

type Campaign = {
  id: string;
  subject: string;
  status: keyof StatusColor;
  createdAt: string;
  body: string;
  recipients: (Contact | ContactGroup)[];
};

type ThemeColor = {
  black: string;
  orange: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
};

type StatusColor = {
  draft: string;
  scheduled: string;
  sent: string;
};

type SelectableRecipient = {
  selected: boolean;
  recipient: Contact | ContactGroup;
};

type EditorVariable = {
  id: string;
  label: string;
  group: string;
  subtext: string;
};

export type {
  Campaign,
  Contact,
  ContactGroup,
  EditorVariable,
  SelectableRecipient,
  ThemeColor,
  StatusColor,
};
