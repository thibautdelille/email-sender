import { useMutation } from '@tanstack/react-query';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const register = ({ email, password }: { email: string; password: string }) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const useRegister = () =>
  useMutation({
    mutationFn: register,
  });
