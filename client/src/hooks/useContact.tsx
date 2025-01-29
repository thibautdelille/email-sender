import { useContacts } from './useContacts';

export const useContact = (id: string | undefined) => {
  const { contacts, ...status } = useContacts();

  return { contact: contacts?.find((r) => r.id === id), ...status };
};
