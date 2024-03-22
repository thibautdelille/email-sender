import { useMutation } from '@tanstack/react-query';
import { db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useUser } from '../provider/userProvider';

const updateUserData = ({
  appPassword,
  name,
}: {
  appPassword: string;
  name: string;
}) => {
  const { user } = useUser();
  if (!user) {
    throw new Error('User not found');
  }
  const userRef = doc(db, 'userData', user.uid);
  return setDoc(userRef, {
    appPassword,
    name,
  });
};

export const useUpdateUserData = () =>
  useMutation({
    mutationFn: updateUserData,
  });
