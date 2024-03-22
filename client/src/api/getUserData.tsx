import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useUser } from '../provider/userProvider';

const getUserData = (uid: string) => {
  const docRef = doc(db, 'userData', uid);
  return getDoc(docRef);
};

export const useGetUserData = () => {
  const { user } = useUser();
  if (!user) {
    throw new Error('User not found');
  }
  return useQuery({
    queryKey: ['userData', user.uid],
    queryFn: async () => {
      getUserData(user.uid);
    },
  });
};
