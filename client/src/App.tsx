import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ChakraProvider } from '@chakra-ui/react';
import { useUser } from './hooks/useUser';
import { Auth } from './components/Auth';
import { UserProvider } from './provider/userProvider';
import { AppRouter } from './routes/AppRouter';

function App() {
  const queryClient = new QueryClient();
  const { user } = useUser();

  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <UserProvider>{user ? <AppRouter /> : <Auth />}</UserProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
