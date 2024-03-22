import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ChakraProvider } from '@chakra-ui/react';
import { Home } from './components/Home';
import { useUser } from './provider/userProvider';
import { Auth } from './components/Auth';

function App() {
  const queryClient = new QueryClient();
  const { user } = useUser();

  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        {user ? <Home /> : <Auth />}
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
