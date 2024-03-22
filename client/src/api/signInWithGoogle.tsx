import { useMutation } from '@tanstack/react-query';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const useSignInWithGoogle = () =>
  useMutation({
    mutationFn: signInWithGoogle,
  });
