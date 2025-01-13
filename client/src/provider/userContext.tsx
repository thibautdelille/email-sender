import { User } from 'firebase/auth';
import { createContext } from 'react';

export type UserContextType = {
  user: User | null;
  accessToken: string | undefined;
  googleAccessToken: string | undefined;
  setGoogleAccessToken: (accessToken: string | undefined) => void;
};
export const userContext = createContext<UserContextType | undefined>(
  undefined
);
