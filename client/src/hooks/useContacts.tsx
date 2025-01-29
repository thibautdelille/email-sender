import { useGetUserData } from '../api/getUserData';
import { useUser } from './useUser';

export const useContacts = () => {
  const { user } = useUser();
  const getUserData = useGetUserData(user?.uid);

  const { data, ...status } = getUserData;

  return { contacts: data?.recipients, ...status };
};
