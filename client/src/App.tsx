import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import {
  Box,
  Card,
  ChakraProvider,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Tr,
} from '@chakra-ui/react';
import { Recipients } from './Recipients';
import { Sender } from './Sender';
import { Message } from './Message';

function App() {
  const queryClient = new QueryClient();
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <Flex gap={4} direction="column">
          <Text fontSize="2xl" fontWeight="bold">
            Personal Email Sender
          </Text>
          <Flex gap={4}>
            <Sender />
            <Message />
          </Flex>
          <Recipients />
        </Flex>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
