import { useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useUser } from '../provider/userProvider';
import { db } from '../config/firebase';
import { UserData } from '../types';
import { useToast } from '@chakra-ui/react';

type UpdateUserData = {
  userId: string;
} & UserData;

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
  const toast = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (props: UpdateUserData) => {
      const savePromise = updateUserData(props);

      toast.promise(savePromise, {
        success: { title: 'Saved' },
        error: { title: 'Something went wrong' },
        loading: { title: 'Saving', description: 'Please wait' },
      });
      return savePromise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    },
  });

  return mutation;
};
