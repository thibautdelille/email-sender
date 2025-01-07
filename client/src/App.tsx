import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ChakraProvider } from '@chakra-ui/react';
import { Home } from './components/Home';
import { useUser } from './hooks/useUser';
import { Auth } from './components/Auth';
import { UserProvider } from './provider/userProvider';

function App() {
  const queryClient = new QueryClient();
  const { user } = useUser();

  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <UserProvider>{user ? <Home /> : <Auth />}</UserProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
