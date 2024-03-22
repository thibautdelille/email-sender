import { User, onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useState } from 'react';
import { auth } from '../config/firebase';

type UserContextType = {
  user: User | null;
};
const userContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  onAuthStateChanged(auth, (u) => {
    if (u) {
      // User is signed in
      setUser(u);
    } else {
      // User is signed out
      setUser(null);
    }
  });

  return (
    <userContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(userContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
