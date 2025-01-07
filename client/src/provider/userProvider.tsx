import { User, onAuthStateChanged } from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from '../config/firebase';
import { userContext } from './userContext';

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  onAuthStateChanged(auth, async (u) => {
    if (u) {
      // User is signed in
      setUser(u);
      const accessToken =
        window.localStorage.getItem('accessToken') || undefined;
      setAccessToken(accessToken);
    } else {
      // User is signed out
      setUser(null);
      setAccessToken(undefined);
    }
  });

  return (
    <userContext.Provider
      value={{
        user,
        accessToken,
        setAccessToken,
      }}
    >
      {children}
    </userContext.Provider>
  );
};
