import { ContactGroup, Contact, ThemeColor } from "../types/general";

const contacts: Contact[] = [
  { id: "1", name: "Thiago", email: "thiago@example.com" },
  { id: "2", name: "Jorge", email: "jorge@example.com" },
  { id: "3", name: "Alice", email: "alice@example.com" },
  { id: "4", name: "Bob", email: "bob@example.com" },
  { id: "5", name: "Charlie", email: "charlie@example.com" },
  { id: "6", name: "David", email: "david@example.com" },
  { id: "7", name: "Eve", email: "eve@example.com" },
  { id: "8", name: "Frank", email: "frank@example.com" },
  { id: "9", name: "Grace", email: "grace@example.com" },
  { id: "10", name: "Hannah", email: "hannah@example.com" },
];

const themeColors: ThemeColor = {
  grey: "0, 0, 0",
  orange: "249, 115, 22",
  red: "225, 29, 72",
  green: "132, 204, 22",
  yellow: "251, 191, 36",
  blue: "6, 182, 212",
};

const contactGroups: ContactGroup[] = [
  { id: "0", label: "All contacts", themeColor: themeColors.grey },
  { id: "1", label: "US customers", themeColor: themeColors.orange },
  { id: "2", label: "Europe customers", themeColor: themeColors.red },
  { id: "3", label: "Asia customers", themeColor: themeColors.green },
  { id: "4", label: "Africa customers", themeColor: themeColors.yellow },
  { id: "5", label: "Australia customers", themeColor: themeColors.blue },
];

export { contacts, contactGroups };
