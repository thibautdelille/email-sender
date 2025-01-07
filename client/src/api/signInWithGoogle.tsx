import { useMutation } from '@tanstack/react-query';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { useUser } from '../hooks/useUser';

const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const useSignInWithGoogle = () => {
  const { setAccessToken } = useUser();
  return useMutation({
    mutationFn: signInWithGoogle,
    onSuccess: async (result) => {
      console.log('result', result);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      window.localStorage.setItem('accessToken', token as string);
      setAccessToken(token);
      console.log('useSignInWithGoogle > tokenResult', token);
    },
  });
};
