import { Contact } from "../types/general";

import { ContactGroup } from "../types/general";

const isContactGroup = (
  recipient: Contact | ContactGroup
): recipient is ContactGroup => {
  return (recipient as ContactGroup).label !== undefined;
};

export { isContactGroup };
