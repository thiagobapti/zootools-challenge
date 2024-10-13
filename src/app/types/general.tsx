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
  orange: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
};

export type { Campaign, Contact, ContactGroup, ThemeColor };
