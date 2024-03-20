import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ChakraProvider, Flex, Text } from '@chakra-ui/react';
import { Recipients } from './components/Recipients';
import { Sender } from './components/Sender';
import { Message } from './components/Message';
import { useState } from 'react';

function App() {
  const queryClient = new QueryClient();
  const [from, setFrom] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState(
    '<p>Hello {name},<br/>Enter your message<br/>Your name</p>'
  );
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <Flex gap={4} direction="column" width="100%">
          <Text fontSize="2xl" fontWeight="bold">
            Personal Email Sender
          </Text>
          <Flex gap={4}>
            <Sender
              from={from}
              setFrom={setFrom}
              appPassword={appPassword}
              setAppPassword={setAppPassword}
              name={name}
              setName={setName}
            />
            <Message
              message={message}
              setMessage={setMessage}
              subject={subject}
              setSubject={setSubject}
            />
          </Flex>
          <Recipients
            from={from}
            name={name}
            appPassword={appPassword}
            subject={subject}
            message={message}
          />
        </Flex>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
