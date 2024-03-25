import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { useUser } from '../provider/userProvider';
import { db } from '../config/firebase';
import { UserData } from '../types';

const getUserData = (userId?: string) => {
  if (!userId) {
    throw new Error('User ID not found');
  }
  const usersRef = doc(db, 'userData', userId);
  return getDoc(usersRef);
};

export const useGetUserData = (userId?: string) => {
  const { user } = useUser();
  if (!user) {
    throw new Error('User not found');
  }
  const query = useQuery({
    queryKey: ['userData', userId],
    queryFn: async () => getUserData(userId),
    enabled: !!userId,
  });

  if (!query.data) {
    return query;
  }
  const userData: UserData = {
    appPassword: query.data.get('appPassword'),
    name: query.data.get('name'),
    subject: query.data.get('subject'),
    message: query.data.get('message'),
    recipients: query.data.get('recipients'),
  };

  return {
    ...query,
    data: userData,
  };
};
