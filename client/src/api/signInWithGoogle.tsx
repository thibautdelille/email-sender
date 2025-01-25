import { useMutation } from '@tanstack/react-query';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { useUser } from '../hooks/useUser';
import { LS_KEY_ACCESS_TOKEN } from '../utils/constants';

const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const useSignInWithGoogle = () => {
  const { setGoogleAccessToken } = useUser();
  return useMutation({
    mutationFn: signInWithGoogle,
    onSuccess: async (result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      console.log(credential);
      window.localStorage.setItem(LS_KEY_ACCESS_TOKEN, token as string);
      setGoogleAccessToken(token);
    },
  });
};
