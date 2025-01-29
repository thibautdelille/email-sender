import { useGetUserData } from '../api/getUserData';
import { useUser } from './useUser';

export const useUserAction = () => {
  const { user } = useUser();
  const getUserData = useGetUserData(user?.uid);

  const { data, ...status } = getUserData;

  return { action: data?.fetchAction, ...status };
};
