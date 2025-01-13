import { useContext } from 'react';
import { userContext } from '../provider/userContext';

export const useUser = () => {
  const context = useContext(userContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
