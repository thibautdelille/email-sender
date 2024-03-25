import { useMutation } from '@tanstack/react-query';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useUser } from '../provider/userProvider';
import { db } from '../config/firebase';
import { UserData } from '../types';

const updateUserData = ({
  userId,
  name,
  appPassword,
  message,
  subject,
  recipients,
}: {
  userId: string;
} & UserData) => {
  const usersRef = collection(db, 'userData');
  return setDoc(doc(usersRef, userId), {
    appPassword,
    name,
    message,
    subject,
    recipients,
  });
};

export const useUpdateUserData = () => {
  const { user } = useUser();
  if (!user) {
    throw new Error('User not found');
  }
  return useMutation({
    mutationFn: updateUserData,
  });
};
