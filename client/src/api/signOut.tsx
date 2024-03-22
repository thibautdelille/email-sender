import { useMutation } from '@tanstack/react-query';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

const logout = () => {
  return signOut(auth);
};

export const useSignOut = () =>
  useMutation({
    mutationFn: logout,
  });
