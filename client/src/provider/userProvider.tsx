import { User, onAuthStateChanged } from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from '../config/firebase';
import { userContext } from './userContext';
import { LS_KEY_ACCESS_TOKEN } from '../utils/constants';

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [googleAccessToken, setGoogleAccessToken] = useState<
    string | undefined
  >(undefined);
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  onAuthStateChanged(auth, async (u) => {
    if (u) {
      // User is signed in
      setUser(u);
      // get access token
      u.getIdToken().then((token) => {
        setAccessToken(token);
      });
      const googleToken =
        window.localStorage.getItem(LS_KEY_ACCESS_TOKEN) || undefined;
      setGoogleAccessToken(googleToken);
    } else {
      // User is signed out
      setUser(null);
      setGoogleAccessToken(undefined);
      setAccessToken(undefined);
      window.localStorage.removeItem(LS_KEY_ACCESS_TOKEN);
    }
  });

  return (
    <userContext.Provider
      value={{
        user,
        accessToken,
        googleAccessToken,
        setGoogleAccessToken,
      }}
    >
      {children}
    </userContext.Provider>
  );
};
